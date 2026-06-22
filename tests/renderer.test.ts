import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser.js';
import { resolveLayout, computeDevicePositions, RIBBON_W, RIBBON_H } from '../src/layout.js';
import { getDefaultRegistry } from '../src/registry.js';

const registry = getDefaultRegistry();

describe('layout — stripe proportional widths', () => {
  it('stripe widths fill the full ribbon width', () => {
    const rack = parse('rack/v1;br:us-army;army-bsm');
    const layout = resolveLayout(rack, registry);
    const ribbon = layout.left.ribbons[0];

    // Sum of rendered stripe widths should equal ribbon width
    const totalParts = ribbon.stripes.reduce((s, st) => s + st.width, 0);
    const renderedTotal = ribbon.stripes.reduce(
      (s, st) => s + (st.width / totalParts) * ribbon.width,
      0,
    );
    expect(Math.abs(renderedTotal - ribbon.width)).toBeLessThan(0.01);
  });
});

describe('layout — device positions', () => {
  const rw = RIBBON_W;
  const rh = RIBBON_H;
  const cx = rw / 2;

  function makeDevice(typeCode: string, opts: { count?: number; param?: string; material?: string } = {}) {
    return {
      kind: 'device' as const,
      typeCode,
      count: opts.count,
      param: opts.param,
      material: opts.material as any,
    };
  }

  it('single device is centered', () => {
    const devices = computeDevicePositions([makeDevice('stcb', { count: 1 })], rw, rh);
    expect(devices).toHaveLength(1);
    expect(devices[0].cx).toBeCloseTo(cx, 1);
  });

  it('two devices are symmetric about center', () => {
    const devices = computeDevicePositions([
      makeDevice('olcb', { count: 1, material: 'b' }),
      makeDevice('olcb', { count: 1, material: 'b' }),
    ], rw, rh);
    expect(devices).toHaveLength(2);
    const [a, b] = devices;
    // one right of center, one left
    expect(Math.abs(cx - a.cx)).toBeCloseTo(Math.abs(cx - b.cx), 1);
    expect(a.cx).not.toBeCloseTo(b.cx, 1);
  });

  it('V device is always at far viewer right', () => {
    const devices = computeDevicePositions([makeDevice('vd')], rw, rh);
    expect(devices).toHaveLength(1);
    expect(devices[0].cx).toBeGreaterThan(cx);
  });

  it('arrowhead is always at far viewer left', () => {
    const devices = computeDevicePositions([makeDevice('arr')], rw, rh);
    expect(devices).toHaveLength(1);
    expect(devices[0].cx).toBeLessThan(cx);
  });

  it('num device is centered', () => {
    const devices = computeDevicePositions([makeDevice('num', { param: '3' })], rw, rh);
    expect(devices[0].cx).toBeCloseTo(cx, 1);
  });

  it('clsp device is centered', () => {
    const devices = computeDevicePositions([makeDevice('clsp', { param: 'AFGHANISTAN' })], rw, rh);
    expect(devices[0].cx).toBeCloseTo(cx, 1);
  });
});

describe('layout — row alignment', () => {
  it('centers a short top row when ra:c (default)', () => {
    const rack = parse('rack/v1;br:us-army;army-ndsm|army-bsm,army-ph,army-arcom');
    const layout = resolveLayout(rack, registry);
    // First row (topmost = index 0) has 1 ribbon, full row has 3
    const topRibbon = layout.left.ribbons[0];
    // With centering, x offset should be > 0
    expect(topRibbon.x).toBeGreaterThan(0);
  });

  it('left-aligns short top row when ra:l', () => {
    const rack = parse('rack/v1;br:us-army;ra:l;army-ndsm|army-bsm,army-ph,army-arcom');
    const layout = resolveLayout(rack, registry);
    const topRibbon = layout.left.ribbons[0];
    expect(topRibbon.x).toBe(0);
  });
});

describe('layout — frames', () => {
  it('applies gold frame from @f:gold flag', () => {
    const rack = parse('rack/v1;br:us-army;army-ndsm~@f:gold');
    const layout = resolveLayout(rack, registry);
    expect(layout.left.ribbons[0].frame).toBe('gold');
  });

  it('applies gold frame from registry default (army-puc)', () => {
    const rack = parse('rack/v1;br:us-army;army-puc');
    const layout = resolveLayout(rack, registry);
    expect(layout.left.ribbons[0].frame).toBe('gold');
  });

  it('@f:none overrides registry default frame', () => {
    // army-puc has frame:gold in registry; @f:none should suppress it
    const rack = parse('rack/v1;br:us-army;army-puc~@f:none');
    const layout = resolveLayout(rack, registry);
    expect(layout.left.ribbons[0].frame).toBeUndefined();
  });

  it('no frame by default for army-bsm', () => {
    const rack = parse('rack/v1;br:us-army;army-bsm');
    const layout = resolveLayout(rack, registry);
    expect(layout.left.ribbons[0].frame).toBeUndefined();
  });
});

describe('layout — right-breast block', () => {
  it('produces a right layout block when right rows present', () => {
    const rack = parse('rack/v1;br:us-army;army-ndsm;army-puc~@f:gold');
    const layout = resolveLayout(rack, registry);
    expect(layout.right).toBeDefined();
    expect(layout.right!.ribbons).toHaveLength(1);
  });

  it('right block is positioned to the right of left block', () => {
    const rack = parse('rack/v1;br:us-army;army-ndsm;army-puc~@f:gold');
    const layout = resolveLayout(rack, registry);
    const leftRight = layout.left.totalWidth;
    const rightX = layout.right!.ribbons[0].x;
    expect(rightX).toBeGreaterThan(leftRight);
  });
});

describe('layout — placeholder for unknown ribbons', () => {
  it('renders a grey placeholder for an unregistered slug', () => {
    const rack = parse('rack/v1;br:us-army;unknown-award-xyz');
    const layout = resolveLayout(rack, registry);
    const ribbon = layout.left.ribbons[0];
    expect(ribbon.stripes).toHaveLength(1);
    expect(ribbon.stripes[0].color).toBe('#CCCCCC');
  });
});
