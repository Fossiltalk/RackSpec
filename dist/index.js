// src/types.ts
var RackSpecParseError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "RackSpecParseError";
  }
};

// src/data/palette.ts
var PALETTE = {
  "old-glory-red": "#BF0A30",
  "old-glory-blue": "#002868",
  "golden-yellow": "#FDD017",
  "imperial-blue": "#004B8D",
  "myrtle-green": "#007A33",
  "crimson": "#990000",
  "scarlet": "#CC0000",
  "white": "#FFFFFF",
  "black": "#000000",
  "gold": "#C5A028",
  "silver": "#A8A9AD",
  // Additional colors used by stub registry ribbons
  "purple": "#4B0082",
  "green": "#006400",
  "tan": "#D2B48C",
  "khaki": "#C3B091",
  "dark-blue": "#00008B",
  "light-blue": "#ADD8E6",
  "dark-green": "#006400",
  "orange": "#FF8C00",
  "maroon": "#800000",
  "navy-blue": "#000080",
  "forest-green": "#228B22",
  "buff": "#F0DC82",
  "sky-blue": "#87CEEB"
};

// src/parser.ts
var HEADER_FIELD_RE = /^[a-z0-9]{1,8}:[a-z0-9-]+$/;
var SLUG_CHARS_RE = /^[a-z0-9-]+$/;
var HEX_COLOR_RE = /^#[0-9A-F]{6}$/;
function parse(input) {
  const raw = maybeDecodeBase64url(input);
  const tokens = raw.split(";");
  if (tokens[0] !== "rack/v1") {
    throw new RackSpecParseError(
      "UNKNOWN_VERSION",
      `Unrecognized version token "${tokens[0]}". Only "rack/v1" is supported.`
    );
  }
  let i = 1;
  const headerRaw = {};
  while (i < tokens.length && HEADER_FIELD_RE.test(tokens[i])) {
    const colonIdx = tokens[i].indexOf(":");
    const key = tokens[i].slice(0, colonIdx);
    const value = tokens[i].slice(colonIdx + 1);
    headerRaw[key] = value;
    i++;
  }
  if (!headerRaw["br"]) {
    throw new RackSpecParseError(
      "MISSING_BR",
      "Required header field 'br' is missing."
    );
  }
  const header = buildHeader(headerRaw);
  const leftBlockRaw = tokens[i] ?? "";
  const rightBlockRaw = tokens[i + 1] ?? "";
  if (!leftBlockRaw.trim()) {
    throw new RackSpecParseError("EMPTY_ROW_BLOCK", "Left-breast row block is empty.");
  }
  const leftRows = parseRowBlock(leftBlockRaw);
  const rightRows = rightBlockRaw.trim() ? parseRowBlock(rightBlockRaw) : void 0;
  return { version: "rack/v1", header, leftRows, rightRows };
}
function buildHeader(raw) {
  return {
    br: raw["br"],
    ut: parseUniformType(raw["ut"]),
    dm: parseDisplayMode(raw["dm"]),
    rw: raw["rw"] === "4" ? 4 : 3,
    ra: parseRowAlignment(raw["ra"]),
    sp: parseRowSpacing(raw["sp"]),
    tx: raw["tx"] === "grille" ? "grille" : "flat"
  };
}
function parseUniformType(v) {
  const valid = ["service", "dress", "mess", "parade", "working", "digital"];
  return valid.includes(v) ? v : "service";
}
function parseDisplayMode(v) {
  const valid = ["full", "top3", "fav9", "mini", "mini-full"];
  return valid.includes(v) ? v : "full";
}
function parseRowAlignment(v) {
  return v === "l" || v === "r" ? v : "c";
}
function parseRowSpacing(v) {
  if (v === "1") return 1;
  if (v === "2") return 2;
  return 0;
}
function parseRowBlock(block) {
  const rowStrings = block.split("|").filter((r) => r.trim().length > 0);
  if (rowStrings.length === 0) {
    throw new RackSpecParseError("EMPTY_ROW_BLOCK", "Row block contains no rows.");
  }
  return rowStrings.map(parseRow);
}
function parseRow(rowStr) {
  const tokenStrings = rowStr.split(",").filter((t) => t.trim().length > 0);
  return tokenStrings.map(parseRibbonToken);
}
function parseRibbonToken(tokenStr) {
  const tildeIdx = tokenStr.indexOf("~");
  const refStr = tildeIdx === -1 ? tokenStr : tokenStr.slice(0, tildeIdx);
  const decorStr = tildeIdx === -1 ? "" : tokenStr.slice(tildeIdx + 1);
  const ref = parseRibbonRef(refStr.trim());
  const decorations = decorStr ? parseDecorationList(decorStr) : [];
  return { ref, decorations };
}
function parseRibbonRef(refStr) {
  if (refStr.startsWith("[")) {
    return parseInlineStripeSpec(refStr);
  }
  if (!SLUG_CHARS_RE.test(refStr)) {
    throw new RackSpecParseError(
      "INVALID_SLUG_CHARS",
      `Invalid characters in slug ID "${refStr}". Only [a-z0-9-] are allowed.`
    );
  }
  return { kind: "slug", id: refStr };
}
function parseInlineStripeSpec(spec) {
  const inner = spec.slice(1, spec.endsWith("]") ? spec.length - 1 : spec.length);
  const stripeStrings = inner.split("_");
  const stripes = [];
  for (const s of stripeStrings) {
    const eqIdx = s.indexOf("=");
    if (eqIdx === -1) {
      console.warn(`[rackspec] Skipping malformed stripe token "${s}" in inline spec.`);
      continue;
    }
    const colorRef = s.slice(0, eqIdx);
    const widthStr = s.slice(eqIdx + 1);
    const width = parseInt(widthStr, 10);
    if (!Number.isInteger(width) || width <= 0) {
      throw new RackSpecParseError(
        "INVALID_STRIPE_WIDTH",
        `Invalid stripe width "${widthStr}" in inline spec.`
      );
    }
    const color = resolveColorRef(colorRef, spec);
    stripes.push({ color, width });
  }
  return { kind: "inline", stripes };
}
function resolveColorRef(ref, context) {
  if (ref.startsWith("$")) {
    const name = ref.slice(1);
    const entry = PALETTE[name];
    if (!entry) {
      console.warn(`[rackspec] Unknown palette color "${name}" in "${context}". Falling back to #CCCCCC.`);
      return "#CCCCCC";
    }
    return entry;
  }
  if (ref.startsWith("#")) {
    if (!HEX_COLOR_RE.test(ref)) {
      throw new RackSpecParseError(
        "INVALID_HEX_COLOR",
        `Invalid hex color "${ref}" \u2014 must be #RRGGBB in uppercase.`
      );
    }
    return ref;
  }
  console.warn(`[rackspec] Unrecognized color reference "${ref}" in "${context}". Falling back to #CCCCCC.`);
  return "#CCCCCC";
}
function parseDecorationList(decorStr) {
  const parts = decorStr.split(".");
  return parts.filter((p) => p.trim().length > 0).map(parseDecorationToken).filter((d) => d !== null);
}
function parseDecorationToken(token) {
  if (token.startsWith("@")) {
    return parseFlagToken(token);
  }
  return parseDeviceToken(token);
}
function parseFlagToken(token) {
  const colonIdx = token.indexOf(":");
  if (colonIdx === -1) {
    console.warn(`[rackspec] Malformed flag token "${token}" \u2014 skipping.`);
    return null;
  }
  const key = token.slice(1, colonIdx);
  const value = token.slice(colonIdx + 1);
  if (key !== "f") {
    console.warn(`[rackspec] Unknown flag key "@${key}" \u2014 skipping.`);
    return null;
  }
  if (value !== "gold" && value !== "silver" && value !== "none") {
    console.warn(`[rackspec] Unknown @f value "${value}" \u2014 skipping.`);
    return null;
  }
  return { kind: "flag", key: "f", value };
}
var TYPE_CODES_WITH_MATERIAL = ["stc", "olc", "hg", "knt", "st"];
var MATERIAL_CODE_RE = /^[bsgw]$/;
var PARAM_DEVICE_RE = /^([a-z]{2,4}):([A-Za-z0-9-]+)(?:@([clr]))?$/;
var SIMPLE_DEVICE_RE = /^([a-z]{2,4})(\d*)(?:@([clr]))?$/;
function parseDeviceToken(token) {
  const pos = extractPosOverride(token);
  const inner = pos ? token.slice(0, token.lastIndexOf("@" + pos)) : token;
  const paramMatch = PARAM_DEVICE_RE.exec(inner);
  if (paramMatch) {
    const [, typeCode, param, posInner] = paramMatch;
    return { kind: "device", typeCode, param, pos: pos ?? posInner ?? void 0 };
  }
  for (const prefix of TYPE_CODES_WITH_MATERIAL) {
    if (inner.startsWith(prefix)) {
      const rest = inner.slice(prefix.length);
      if (rest.length === 0 || MATERIAL_CODE_RE.test(rest[0]) || /\d/.test(rest[0])) {
        const material = rest.length > 0 && MATERIAL_CODE_RE.test(rest[0]) ? rest[0] : void 0;
        const countStr = material ? rest.slice(1) : rest;
        if (countStr.length > 0 && !/^\d+$/.test(countStr)) break;
        const count = countStr ? parseInt(countStr, 10) : void 0;
        if (count !== void 0 && (count < 1 || !Number.isInteger(count))) {
          console.warn(`[rackspec] Invalid device count "${countStr}" in "${token}" \u2014 skipping.`);
          return null;
        }
        return { kind: "device", typeCode: prefix, material, count, pos };
      }
    }
  }
  const simpleMatch = SIMPLE_DEVICE_RE.exec(inner);
  if (simpleMatch) {
    const [, typeCode, countStr, posInner] = simpleMatch;
    const count = countStr ? parseInt(countStr, 10) : void 0;
    if (count !== void 0 && (count < 1 || !Number.isInteger(count))) {
      console.warn(`[rackspec] Invalid device count "${countStr}" in "${token}" \u2014 skipping.`);
      return null;
    }
    return { kind: "device", typeCode, count, pos: pos ?? posInner ?? void 0 };
  }
  console.warn(`[rackspec] Could not parse device token "${token}" \u2014 skipping.`);
  return null;
}
function extractPosOverride(token) {
  const m = /@([clr])$/.exec(token);
  return m ? m[1] : void 0;
}
function maybeDecodeBase64url(input) {
  if (input.startsWith("rack/v")) return input;
  try {
    const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(b64);
    if (decoded.startsWith("rack/v")) return decoded;
  } catch {
  }
  return input;
}

// src/data/ribbons.ts
var STUB_RIBBONS = [
  // ─── Army ──────────────────────────────────────────────────────────────────
  {
    // Exact stripe definition from spec §13.4
    id: "army-bsm",
    name: "Bronze Star Medal",
    branch: ["us-army"],
    stripes: [
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 3 },
      { color: "#FFFFFF", width: 1 },
      { color: "$imperial-blue", width: 3 },
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 3 },
      { color: "#FFFFFF", width: 1 }
    ],
    authorizedDevices: ["olcb", "olcs", "vd"],
    frame: "none"
  },
  {
    // Exact stripe definition from spec §13.4
    id: "army-puc",
    name: "Presidential Unit Citation",
    branch: ["us-army"],
    stripes: [
      { color: "$imperial-blue", width: 14 }
    ],
    authorizedDevices: ["stcb", "stcs"],
    frame: "gold"
  },
  {
    id: "army-ph",
    name: "Purple Heart",
    branch: ["us-army"],
    stripes: [
      { color: "$scarlet", width: 1 },
      { color: "#4B2D7F", width: 5 },
      // purple
      { color: "$scarlet", width: 1 }
    ],
    authorizedDevices: ["olcb", "olcs"],
    frame: "none"
  },
  {
    id: "army-arcom",
    name: "Army Commendation Medal",
    branch: ["us-army"],
    stripes: [
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$myrtle-green", width: 5 },
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 1 },
      { color: "#FFFFFF", width: 1 }
    ],
    authorizedDevices: ["olcb", "olcs", "vd"],
    frame: "none"
  },
  {
    id: "army-gcm",
    name: "Army Good Conduct Medal",
    branch: ["us-army"],
    stripes: [
      { color: "$scarlet", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 9 },
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 1 }
    ],
    authorizedDevices: ["kntb", "num"],
    frame: "none"
  },
  {
    id: "army-ndsm",
    name: "National Defense Service Medal",
    branch: ["us-army", "us-navy", "us-usmc", "us-af", "us-ssf", "us-uscg"],
    stripes: [
      { color: "$old-glory-red", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$imperial-blue", width: 1 },
      { color: "#C5A028", width: 3 },
      // gold
      { color: "$imperial-blue", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$old-glory-red", width: 1 }
    ],
    authorizedDevices: ["stcb", "stcs"],
    frame: "none"
  },
  {
    id: "army-gwots",
    name: "Global War on Terrorism Service Medal",
    branch: ["us-army", "us-navy", "us-usmc", "us-af", "us-ssf", "us-uscg"],
    stripes: [
      { color: "$imperial-blue", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$old-glory-red", width: 5 },
      { color: "$imperial-blue", width: 1 },
      { color: "#C5A028", width: 3 },
      { color: "$imperial-blue", width: 1 },
      { color: "$old-glory-red", width: 5 },
      { color: "#FFFFFF", width: 1 },
      { color: "$imperial-blue", width: 1 }
    ],
    authorizedDevices: [],
    frame: "none"
  },
  {
    id: "army-msm",
    name: "Meritorious Service Medal",
    branch: ["us-army"],
    stripes: [
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "#4B2D7F", width: 7 },
      // purple
      { color: "#FFFFFF", width: 1 },
      { color: "$scarlet", width: 1 },
      { color: "#FFFFFF", width: 1 }
    ],
    authorizedDevices: ["olcb", "olcs"],
    frame: "none"
  },
  {
    id: "army-afrm",
    name: "Armed Forces Reserve Medal",
    branch: ["us-army"],
    stripes: [
      { color: "$old-glory-red", width: 2 },
      { color: "#FFFFFF", width: 1 },
      { color: "$imperial-blue", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$old-glory-red", width: 1 },
      { color: "$imperial-blue", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$old-glory-red", width: 1 },
      { color: "$imperial-blue", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$old-glory-red", width: 2 }
    ],
    authorizedDevices: ["hgb", "hgs", "hgg", "md"],
    frame: "none"
  },
  // ─── Navy ──────────────────────────────────────────────────────────────────
  {
    id: "navy-achievement",
    name: "Navy and Marine Corps Achievement Medal",
    branch: ["us-navy", "us-usmc"],
    stripes: [
      { color: "#000080", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "#000080", width: 2 },
      { color: "#C5A028", width: 5 },
      // gold center
      { color: "#000080", width: 2 },
      { color: "#FFFFFF", width: 1 },
      { color: "#000080", width: 1 }
    ],
    authorizedDevices: ["stg", "sts", "vd"],
    frame: "none"
  },
  // ─── Air Force ─────────────────────────────────────────────────────────────
  {
    id: "af-dfc",
    name: "Distinguished Flying Cross",
    branch: ["us-af", "us-army"],
    stripes: [
      { color: "#FFFFFF", width: 1 },
      { color: "$old-glory-red", width: 1 },
      { color: "#FFFFFF", width: 1 },
      { color: "$imperial-blue", width: 5 },
      { color: "#FFFFFF", width: 1 },
      { color: "$old-glory-red", width: 1 },
      { color: "#FFFFFF", width: 1 }
    ],
    authorizedDevices: ["olcb", "olcs", "stg", "sts", "vd", "cd"],
    frame: "none"
  },
  // ─── NATO / International ───────────────────────────────────────────────────
  {
    id: "nato-medal",
    name: "NATO Medal",
    branch: ["us-army", "us-navy", "us-usmc", "us-af", "us-uscg", "nato"],
    stripes: [
      { color: "$imperial-blue", width: 5 },
      { color: "#FFFFFF", width: 2 },
      { color: "$imperial-blue", width: 13 },
      { color: "#FFFFFF", width: 2 },
      { color: "$imperial-blue", width: 5 }
    ],
    authorizedDevices: ["clsp"],
    frame: "none"
  }
];

// src/registry.ts
function loadRegistry(entries) {
  const map = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!entry.id || !entry.name || !entry.branch || !entry.stripes) {
      console.warn(`[rackspec] Registry entry missing required fields \u2014 skipping.`, entry);
      continue;
    }
    if (map.has(entry.id)) {
      throw new Error(`[rackspec] Duplicate registry ID "${entry.id}". Registry load aborted.`);
    }
    map.set(entry.id, entry);
  }
  return { entries: map };
}
function mergeRegistry(base, overrides) {
  const merged = new Map(base.entries);
  for (const entry of overrides) {
    if (!entry.id || !entry.name || !entry.branch || !entry.stripes) {
      console.warn(`[rackspec] Override registry entry missing required fields \u2014 skipping.`, entry);
      continue;
    }
    merged.set(entry.id, entry);
  }
  return { entries: merged };
}
function resolveSlug(registry, id) {
  return registry.entries.get(id) ?? null;
}
function resolveStripeColor(color) {
  if (color.startsWith("$")) {
    const name = color.slice(1);
    const hex = PALETTE[name];
    if (!hex) {
      console.warn(`[rackspec] Unknown palette color "${name}" in registry \u2014 using #CCCCCC.`);
      return "#CCCCCC";
    }
    return hex;
  }
  return color;
}
var _defaultRegistry = null;
function getDefaultRegistry() {
  if (!_defaultRegistry) {
    _defaultRegistry = loadRegistry(STUB_RIBBONS);
  }
  return _defaultRegistry;
}

// src/layout.ts
var RIBBON_W = 133;
var RIBBON_H = 36;
var FRAME_W = 140;
var FRAME_H = 48;
var RIBBON_GAP = 2;
var ROW_SPACING = { 0: 0, 1: 12, 2: 24 };
var STAR_PERSONAL_D = 30;
var STAR_CAMPAIGN_D = 18;
var OLC_SIZE = 26;
var KNOT_W = 18;
var KNOT_H = 10;
function resolveLayout(rack, registry, scale = 96) {
  const scaleFactor = scale / 96;
  const left = layoutBlock(rack.leftRows, rack.header, registry, 0, 0, scaleFactor);
  let right;
  if (rack.rightRows) {
    const rightX = left.totalWidth + Math.round(20 * scaleFactor);
    right = layoutBlock(rack.rightRows, rack.header, registry, rightX, 0, scaleFactor);
  }
  const totalWidth = right ? left.totalWidth + Math.round(20 * scaleFactor) + right.totalWidth : left.totalWidth;
  const totalHeight = Math.max(left.totalHeight, right?.totalHeight ?? 0);
  return { left, right, totalWidth, totalHeight };
}
function layoutBlock(rows, header, registry, offsetX, offsetY, scaleFactor) {
  const ribbons = [];
  const rw = Math.round(RIBBON_W * scaleFactor);
  const rh = Math.round(RIBBON_H * scaleFactor);
  const gap = Math.round(RIBBON_GAP * scaleFactor);
  const rowSpacingPx = Math.round(ROW_SPACING[header.sp] * scaleFactor);
  const maxPerRow = header.rw;
  let currentY = offsetY;
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const isTopRow = rowIdx === 0;
    const count = row.length;
    let rowOffsetX = offsetX;
    if (isTopRow && count < maxPerRow) {
      const fullRowWidth2 = maxPerRow * rw + (maxPerRow - 1) * gap;
      const thisRowWidth = count * rw + (count - 1) * gap;
      if (header.ra === "c") {
        rowOffsetX = offsetX + Math.round((fullRowWidth2 - thisRowWidth) / 2);
      } else if (header.ra === "r") {
        rowOffsetX = offsetX + (fullRowWidth2 - thisRowWidth);
      }
    }
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const token = row[colIdx];
      const x = rowOffsetX + colIdx * (rw + gap);
      const y = currentY;
      const { stripes, frame, name } = resolveRibbonVisuals(token, registry);
      const useFrame = frame && frame !== "none";
      const fw = useFrame ? Math.round(FRAME_W * scaleFactor) : rw;
      const fh = useFrame ? Math.round(FRAME_H * scaleFactor) : rh;
      const devices = computeDevicePositions(token.decorations, fw, fh, scaleFactor);
      ribbons.push({ x, y, width: fw, height: fh, stripes, frame, devices, name });
    }
    currentY += rh + (rowIdx < rows.length - 1 ? rowSpacingPx : 0);
  }
  const fullRowWidth = maxPerRow * rw + (maxPerRow - 1) * gap;
  const totalHeight = currentY - offsetY;
  return { ribbons, totalWidth: fullRowWidth, totalHeight };
}
function resolveRibbonVisuals(token, registry, scaleFactor) {
  let stripes;
  let registryFrame;
  let name;
  if (token.ref.kind === "slug") {
    const entry = resolveSlug(registry, token.ref.id);
    if (!entry) {
      console.warn(`[rackspec] Unknown ribbon ID "${token.ref.id}" \u2014 rendering placeholder.`);
      stripes = [{ color: "#CCCCCC", width: 1 }];
    } else {
      stripes = entry.stripes.map((s) => ({ color: resolveStripeColor(s.color), width: s.width }));
      registryFrame = entry.frame;
      name = entry.name;
    }
  } else {
    stripes = token.ref.stripes;
  }
  let explicitFrame = null;
  for (const d of token.decorations) {
    if (d.kind === "flag" && d.key === "f") {
      explicitFrame = d.value;
    }
  }
  let frame;
  if (explicitFrame !== null) {
    frame = explicitFrame === "none" ? void 0 : explicitFrame;
  } else if (registryFrame && registryFrame !== "none") {
    frame = registryFrame;
  }
  return { stripes, frame, name };
}
function computeDevicePositions(decorations, ribbonW, ribbonH, scaleFactor = 1) {
  const deviceTokens = decorations.filter((d) => d.kind === "device");
  if (deviceTokens.length === 0) return [];
  const cy = ribbonH / 2;
  const cx = ribbonW / 2;
  const explicit = [];
  const auto = [];
  for (const dt of deviceTokens) {
    if (dt.pos) {
      const deviceCx = dt.pos === "c" ? cx : dt.pos === "r" ? cx + ribbonW / 4 : cx - ribbonW / 4;
      explicit.push({ ...dt, cx: deviceCx, cy });
    } else {
      auto.push(dt);
    }
  }
  const autoLayout = placeAutoDevices(auto, ribbonW, ribbonH, cx, cy, scaleFactor);
  return [...explicit, ...autoLayout];
}
function placeAutoDevices(devices, ribbonW, ribbonH, cx, cy, scaleFactor) {
  if (devices.length === 0) return [];
  const result = [];
  const remaining = [];
  for (const dt of devices) {
    if (dt.typeCode === "vd") {
      result.push({ ...dt, cx: ribbonW - Math.round(14 * scaleFactor), cy });
    } else if (dt.typeCode === "arr") {
      result.push({ ...dt, cx: Math.round(14 * scaleFactor), cy });
    } else if (dt.typeCode === "mid") {
      result.push({ ...dt, cx, cy });
    } else if (dt.typeCode === "clsp") {
      result.push({ ...dt, cx, cy });
    } else if (dt.typeCode === "num") {
      result.push({ ...dt, cx, cy });
    } else if (dt.typeCode === "ros") {
      result.push({ ...dt, cx, cy });
    } else {
      remaining.push(dt);
    }
  }
  const knots = remaining.filter((d) => d.typeCode === "knt");
  const others = remaining.filter((d) => d.typeCode !== "knt");
  if (knots.length > 0) {
    const knotDt = knots[0];
    const n = knotDt.count ?? 1;
    const kw = Math.round(KNOT_W * scaleFactor);
    const totalKnotWidth = n * kw + (n - 1) * Math.round(4 * scaleFactor);
    const startX = (ribbonW - totalKnotWidth) / 2 + kw / 2;
    for (let i = 0; i < n; i++) {
      result.push({
        typeCode: "knt",
        material: knotDt.material,
        count: 1,
        // emit individually for rendering
        cx: startX + i * (kw + Math.round(4 * scaleFactor)),
        cy
      });
    }
  }
  if (others.length === 0) return result;
  placeSymmetric(others, cx, cy, ribbonW, scaleFactor, result);
  return result;
}
function placeSymmetric(devices, cx, cy, ribbonW, scaleFactor, out) {
  const step = Math.round(22 * scaleFactor);
  const silverDevice = devices.find(
    (d) => d.typeCode === "olcs" || d.typeCode === "sts" || d.typeCode === "stcs"
  );
  if (silverDevice) {
    out.push({ ...silverDevice, cx, cy });
    const goldDevices = devices.filter((d) => d !== silverDevice);
    placeRadial(goldDevices, cx, cy, step, out);
    return;
  }
  switch (devices.length) {
    case 1:
      out.push({ ...devices[0], cx, cy });
      break;
    case 2:
      out.push({ ...devices[0], cx: cx + step, cy });
      out.push({ ...devices[1], cx: cx - step, cy });
      break;
    case 3:
      out.push({ ...devices[0], cx, cy });
      out.push({ ...devices[1], cx: cx + step, cy });
      out.push({ ...devices[2], cx: cx - step, cy });
      break;
    case 4:
      out.push({ ...devices[0], cx: cx + step, cy });
      out.push({ ...devices[1], cx: cx - step, cy });
      out.push({ ...devices[2], cx: cx + step * 2.2, cy });
      out.push({ ...devices[3], cx: cx - step * 2.2, cy });
      break;
    case 5:
      out.push({ ...devices[0], cx, cy });
      out.push({ ...devices[1], cx: cx + step, cy });
      out.push({ ...devices[2], cx: cx - step, cy });
      out.push({ ...devices[3], cx: cx + step * 2.2, cy });
      out.push({ ...devices[4], cx: cx - step * 2.2, cy });
      break;
    default:
      for (let i = 0; i < devices.length; i++) {
        out.push({ ...devices[i], cx: cx + (i - (devices.length - 1) / 2) * step, cy });
      }
  }
}
function placeRadial(devices, cx, cy, step, out) {
  for (let i = 0; i < devices.length; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const offset = Math.ceil((i + 1) / 2) * step;
    out.push({ ...devices[i], cx: cx + side * offset, cy });
  }
}

// src/devices.ts
var MATERIAL_COLORS = {
  b: { fill: "#8B5A2B", stroke: "#5C3A1A" },
  // bronze
  s: { fill: "#A8A9AD", stroke: "#707070" },
  // silver
  g: { fill: "#C5A028", stroke: "#8B6914" },
  // gold
  w: { fill: "#FFFFFF", stroke: "#AAAAAA" }
  // white/enamel
};
function matColor(material, defaultMat) {
  return MATERIAL_COLORS[material ?? defaultMat] ?? MATERIAL_COLORS[defaultMat];
}
function starPoints(cx, cy, r) {
  const inner = r * 0.382;
  const points = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = outerAngle + 36 * (Math.PI / 180);
    points.push(`${(cx + r * Math.cos(outerAngle)).toFixed(2)},${(cy + r * Math.sin(outerAngle)).toFixed(2)}`);
    points.push(`${(cx + inner * Math.cos(innerAngle)).toFixed(2)},${(cy + inner * Math.sin(innerAngle)).toFixed(2)}`);
  }
  return points.join(" ");
}
function renderStar(d, diameter, defaultMat) {
  const r = diameter / 2;
  const { fill, stroke } = matColor(d.material, defaultMat);
  const pts = starPoints(d.cx, d.cy, r);
  return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}
function renderOLC(d, scaleFactor) {
  const { fill, stroke } = matColor(d.material, "b");
  const s = OLC_SIZE * scaleFactor;
  const r = s / 2;
  const stem = s * 0.15;
  const lobeR = r * 0.42;
  return [
    // Center lobe
    `<circle cx="${d.cx.toFixed(2)}" cy="${(d.cy - r * 0.2).toFixed(2)}" r="${lobeR.toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    // Left lobe
    `<circle cx="${(d.cx - r * 0.45).toFixed(2)}" cy="${(d.cy + r * 0.15).toFixed(2)}" r="${(lobeR * 0.85).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    // Right lobe
    `<circle cx="${(d.cx + r * 0.45).toFixed(2)}" cy="${(d.cy + r * 0.15).toFixed(2)}" r="${(lobeR * 0.85).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    // Stem
    `<rect x="${(d.cx - stem / 2).toFixed(2)}" y="${(d.cy + r * 0.3).toFixed(2)}" width="${stem.toFixed(2)}" height="${(r * 0.45).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="0.5"/>`
  ].join("");
}
function renderHourglass(d, scaleFactor) {
  const { fill, stroke } = matColor(d.material, "b");
  const w = Math.round(14 * scaleFactor);
  const h = Math.round(18 * scaleFactor);
  const x = d.cx - w / 2;
  const y = d.cy - h / 2;
  const mx = d.cx;
  const my = d.cy;
  const top = `M ${x.toFixed(1)},${y.toFixed(1)} L ${(x + w).toFixed(1)},${y.toFixed(1)} L ${mx.toFixed(1)},${my.toFixed(1)} Z`;
  const bot = `M ${x.toFixed(1)},${(y + h).toFixed(1)} L ${(x + w).toFixed(1)},${(y + h).toFixed(1)} L ${mx.toFixed(1)},${my.toFixed(1)} Z`;
  return `<path d="${top} ${bot}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}
function renderArrowhead(d, scaleFactor) {
  const w = Math.round(12 * scaleFactor);
  const h = Math.round(14 * scaleFactor);
  const x = d.cx;
  const y = d.cy;
  const pts = `${x.toFixed(1)},${(y - h / 2).toFixed(1)} ${(x + w / 2).toFixed(1)},${(y + h / 2).toFixed(1)} ${(x - w / 2).toFixed(1)},${(y + h / 2).toFixed(1)}`;
  return `<polygon points="${pts}" fill="#8B5A2B" stroke="#5C3A1A" stroke-width="1"/>`;
}
var LETTER_MAP = {
  vd: "V",
  cd: "C",
  rd: "R",
  od: "O",
  md: "M"
};
function renderLetterDevice(d, ribbonH, scaleFactor) {
  const letter = LETTER_MAP[d.typeCode] ?? d.typeCode.toUpperCase();
  const fontSize = Math.round(ribbonH * 0.65);
  return `<text x="${d.cx.toFixed(2)}" y="${(d.cy + fontSize * 0.35).toFixed(2)}" font-family="serif" font-size="${fontSize}" font-weight="bold" fill="#C5A028" stroke="#8B6914" stroke-width="0.5" text-anchor="middle">${letter}</text>`;
}
function renderNumeral(d, ribbonH, scaleFactor) {
  const n = d.param ?? String(d.count ?? "?");
  const fontSize = Math.round(ribbonH * 0.7);
  return `<text x="${d.cx.toFixed(2)}" y="${(d.cy + fontSize * 0.35).toFixed(2)}" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="#C5A028" stroke="#8B6914" stroke-width="0.5" text-anchor="middle">${n}</text>`;
}
function renderKnot(d, scaleFactor) {
  const w = Math.round(KNOT_W * scaleFactor);
  const h = Math.round(KNOT_H * scaleFactor);
  const x = d.cx - w / 2;
  const y = d.cy - h / 2;
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" rx="2" fill="#8B5A2B" stroke="#5C3A1A" stroke-width="1"/>`;
}
function renderClasp(d, ribbonW, ribbonH, scaleFactor) {
  const label = d.param ?? "";
  const h = Math.round(ribbonH * 0.6);
  const w = Math.round(ribbonW * 0.75);
  const x = d.cx - w / 2;
  const y = d.cy - h / 2;
  const fontSize = Math.round(h * 0.55);
  return [
    `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" rx="2" fill="#C5A028" stroke="#8B6914" stroke-width="1"/>`,
    `<text x="${d.cx.toFixed(1)}" y="${(d.cy + fontSize * 0.3).toFixed(1)}" font-family="sans-serif" font-size="${fontSize}" fill="#000000" text-anchor="middle">${label}</text>`
  ].join("");
}
function renderRosette(d, scaleFactor) {
  const r = Math.round(10 * scaleFactor);
  const { fill, stroke } = matColor("g", "g");
  const innerR = Math.round(r * 0.5);
  return [
    `<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    `<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="${innerR}" fill="${stroke}" stroke="${stroke}" stroke-width="0.5"/>`
  ].join("");
}
function renderMID(d, scaleFactor) {
  const { fill, stroke } = matColor("s", "s");
  const s = OLC_SIZE * scaleFactor * 0.8;
  const r = s / 2;
  const lobeR = r * 0.42;
  return [
    `<circle cx="${d.cx.toFixed(2)}" cy="${d.cy.toFixed(2)}" r="${lobeR.toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    `<circle cx="${(d.cx - r * 0.5).toFixed(2)}" cy="${d.cy.toFixed(2)}" r="${(lobeR * 0.8).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    `<circle cx="${(d.cx + r * 0.5).toFixed(2)}" cy="${d.cy.toFixed(2)}" r="${(lobeR * 0.8).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`
  ].join("");
}
function renderFrame(x, y, w, h, style) {
  const color = style === "gold" ? "#C5A028" : "#A8A9AD";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="3"/>`;
}
function renderDevice(d, ribbonW, ribbonH, scaleFactor) {
  switch (d.typeCode) {
    // Personal award stars — type code 'st', material g/s (§8.2.2)
    case "st":
      return renderStar(d, STAR_PERSONAL_D * scaleFactor, d.material ?? "g");
    // Campaign/service stars — type code 'stc', material b/s (§8.2.2)
    case "stc":
      return renderStar(d, STAR_CAMPAIGN_D * scaleFactor, d.material ?? "b");
    // Oak leaf clusters — type code 'olc', material b/s (§8.2.2)
    case "olc":
      return renderOLC(d, scaleFactor);
    // Hourglass — type code 'hg', material b/s/g (§8.2.2)
    case "hg":
      return renderHourglass(d, scaleFactor);
    // Arrowhead
    case "arr":
      return renderArrowhead(d, scaleFactor);
    // Letter devices
    case "vd":
    case "cd":
    case "rd":
    case "od":
    case "md":
      return renderLetterDevice(d, ribbonH);
    // Numeral
    case "num":
      return renderNumeral(d, ribbonH);
    // Knot clasp — type code 'knt', material b (§8.2.2)
    case "knt":
      return renderKnot(d, scaleFactor);
    // Named clasp
    case "clsp":
      return renderClasp(d, ribbonW, ribbonH);
    // Rosette
    case "ros":
      return renderRosette(d, scaleFactor);
    // MID oak leaf
    case "mid":
      return renderMID(d, scaleFactor);
    // MBR (mention in despatches bars)
    case "mbr": {
      const n = d.count ?? 1;
      const bw = Math.round(ribbonW * 0.4);
      const bh = Math.round(ribbonH * 0.25);
      return Array.from(
        { length: n },
        (_, i) => `<rect x="${(d.cx - bw / 2).toFixed(1)}" y="${(d.cy - bh / 2 + i * (bh + 2)).toFixed(1)}" width="${bw}" height="${bh}" fill="#C5A028" stroke="#8B6914" stroke-width="0.5"/>`
      ).join("");
    }
    default:
      console.warn(`[rackspec] Unknown device type code "${d.typeCode}" \u2014 skipping.`);
      return "";
  }
}

// src/renderer.ts
var SVG_NS = "http://www.w3.org/2000/svg";
function renderLayout(rack, options = {}) {
  const scale = options.scale ?? 96;
  const scaleFactor = scale / 96;
  let registry = getDefaultRegistry();
  if (options.registry && options.registry.length > 0) {
    registry = mergeRegistry(registry, options.registry);
  }
  const layout = resolveLayout(rack, registry, scale);
  return emitSVG(layout, scaleFactor);
}
function emitSVG(layout, scaleFactor) {
  const pad = Math.round(4 * scaleFactor);
  const totalW = layout.totalWidth + pad * 2;
  const totalH = layout.totalHeight + pad * 2;
  const leftSvg = emitBlock(layout.left, pad, pad, scaleFactor);
  const rightSvg = layout.right ? emitBlock(layout.right, pad + layout.left.totalWidth + Math.round(20 * scaleFactor), pad, scaleFactor) : "";
  return [
    `<svg xmlns="${SVG_NS}" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" role="img">`,
    leftSvg,
    rightSvg,
    "</svg>"
  ].join("\n");
}
function emitBlock(block, offsetX, offsetY, scaleFactor) {
  return block.ribbons.map((r) => emitRibbon(r, offsetX, offsetY, scaleFactor)).join("\n");
}
function emitRibbon(r, offsetX, offsetY, scaleFactor) {
  const x = r.x + offsetX;
  const y = r.y + offsetY;
  const parts = [];
  const label = r.name ? ` aria-label="${escapeXml(r.name)}"` : "";
  parts.push(`<g${label}>`);
  parts.push(emitStripes(x, y, r.width, r.height, r.stripes));
  if (r.frame) {
    parts.push(renderFrame(x, y, r.width, r.height, r.frame));
  }
  for (const device of r.devices) {
    const svgDevice = renderDevice(
      { ...device, cx: device.cx + x, cy: device.cy + y },
      r.width,
      r.height,
      scaleFactor
    );
    if (svgDevice) parts.push(svgDevice);
  }
  parts.push("</g>");
  return parts.join("\n");
}
function emitStripes(x, y, totalW, totalH, stripes) {
  if (stripes.length === 0) {
    return `<rect x="${x}" y="${y}" width="${totalW}" height="${totalH}" fill="#CCCCCC"/>`;
  }
  const totalParts = stripes.reduce((s, st) => s + st.width, 0);
  const parts = [];
  let currentX = x;
  for (const stripe of stripes) {
    const stripeW = stripe.width / totalParts * totalW;
    parts.push(
      `<rect x="${currentX.toFixed(2)}" y="${y}" width="${stripeW.toFixed(2)}" height="${totalH}" fill="${stripe.color}"/>`
    );
    currentX += stripeW;
  }
  return parts.join("");
}
function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/index.ts
function renderSpec(spec, options) {
  const rack = parse(spec);
  return renderLayout(rack, options);
}

export { PALETTE, RackSpecParseError, STUB_RIBBONS, getDefaultRegistry, loadRegistry, mergeRegistry, parse, renderLayout as render, renderSpec, resolveSlug };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map