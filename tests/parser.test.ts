import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser.js';
import { RackSpecParseError } from '../src/types.js';

describe('parser — version validation', () => {
  it('accepts rack/v1', () => {
    const result = parse('rack/v1;br:us-army;army-ndsm');
    expect(result.version).toBe('rack/v1');
  });

  it('rejects rack/v2', () => {
    expect(() => parse('rack/v2;br:us-army;army-ndsm')).toThrow(RackSpecParseError);
    expect(() => parse('rack/v2;br:us-army;army-ndsm')).toThrow('rack/v1');
  });

  it('rejects missing version prefix', () => {
    expect(() => parse('br:us-army;army-ndsm')).toThrow(RackSpecParseError);
  });
});

describe('parser — header parsing', () => {
  it('applies defaults for missing optional fields', () => {
    const { header } = parse('rack/v1;br:us-army;army-ndsm');
    expect(header.br).toBe('us-army');
    expect(header.ut).toBe('service');
    expect(header.dm).toBe('full');
    expect(header.rw).toBe(3);
    expect(header.ra).toBe('c');
    expect(header.sp).toBe(0);
    expect(header.tx).toBe('flat');
  });

  it('parses all header fields', () => {
    const { header } = parse('rack/v1;br:us-navy;ut:dress;dm:top3;rw:4;ra:l;sp:2;tx:grille;navy-achievement');
    expect(header.br).toBe('us-navy');
    expect(header.ut).toBe('dress');
    expect(header.dm).toBe('top3');
    expect(header.rw).toBe(4);
    expect(header.ra).toBe('l');
    expect(header.sp).toBe(2);
    expect(header.tx).toBe('grille');
  });

  it('rejects missing br field', () => {
    expect(() => parse('rack/v1;ut:dress;army-ndsm')).toThrow(RackSpecParseError);
    expect(() => parse('rack/v1;ut:dress;army-ndsm')).toThrow("'br'");
  });

  it('detects header/row boundary correctly', () => {
    // A slug with no colon starts the row block
    const { header, leftRows } = parse('rack/v1;br:us-army;tx:grille;army-ndsm');
    expect(header.tx).toBe('grille');
    expect(leftRows[0][0].ref).toEqual({ kind: 'slug', id: 'army-ndsm' });
  });
});

describe('parser — row structure', () => {
  it('parses multiple rows (| separator)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-bsm,army-ph,army-arcom|army-ndsm,army-gwots,army-gcm');
    expect(leftRows).toHaveLength(2);
    expect(leftRows[0]).toHaveLength(3);
    expect(leftRows[1]).toHaveLength(3);
  });

  it('parses single ribbon per row', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-ndsm');
    expect(leftRows).toHaveLength(1);
    expect(leftRows[0]).toHaveLength(1);
  });

  it('parses right-breast block', () => {
    const { leftRows, rightRows } = parse('rack/v1;br:us-army;army-ndsm;army-puc~@f:gold');
    expect(leftRows).toBeDefined();
    expect(rightRows).toBeDefined();
    expect(rightRows![0][0].ref).toEqual({ kind: 'slug', id: 'army-puc' });
  });

  it('omits rightRows when not present', () => {
    const { rightRows } = parse('rack/v1;br:us-army;army-ndsm');
    expect(rightRows).toBeUndefined();
  });
});

describe('parser — ribbon references', () => {
  it('parses slug ID', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-bsm');
    expect(leftRows[0][0].ref).toEqual({ kind: 'slug', id: 'army-bsm' });
  });

  it('rejects invalid slug chars', () => {
    expect(() => parse('rack/v1;br:us-army;Army_BSM')).toThrow(RackSpecParseError);
  });

  it('parses inline stripe spec with palette colors', () => {
    const { leftRows } = parse('rack/v1;br:us-army;[$imperial-blue=5_#FFFFFF=2_$old-glory-red=5]');
    const ref = leftRows[0][0].ref;
    expect(ref.kind).toBe('inline');
    if (ref.kind === 'inline') {
      expect(ref.stripes).toHaveLength(3);
      expect(ref.stripes[0].color).toBe('#004B8D'); // imperial-blue
      expect(ref.stripes[0].width).toBe(5);
      expect(ref.stripes[1].color).toBe('#FFFFFF');
      expect(ref.stripes[1].width).toBe(2);
      expect(ref.stripes[2].color).toBe('#BF0A30'); // old-glory-red
    }
  });

  it('parses inline stripe spec with hex colors', () => {
    const { leftRows } = parse('rack/v1;br:us-army;[#FF0000=3_#00FF00=3_#0000FF=3]');
    const ref = leftRows[0][0].ref;
    expect(ref.kind).toBe('inline');
    if (ref.kind === 'inline') {
      expect(ref.stripes[0].color).toBe('#FF0000');
    }
  });

  it('rejects invalid stripe width', () => {
    expect(() => parse('rack/v1;br:us-army;[$imperial-blue=0]')).toThrow(RackSpecParseError);
  });
});

describe('parser — decorations', () => {
  it('parses flag token @f:gold', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-puc~@f:gold');
    const decorations = leftRows[0][0].decorations;
    expect(decorations).toHaveLength(1);
    expect(decorations[0]).toEqual({ kind: 'flag', key: 'f', value: 'gold' });
  });

  it('parses device token with count (olcb2)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-bsm~olcb2');
    const decorations = leftRows[0][0].decorations;
    expect(decorations).toHaveLength(1);
    expect(decorations[0]).toMatchObject({ kind: 'device', typeCode: 'olc', material: 'b', count: 2 });
  });

  it('parses parameterized device (num:5)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-bsm~num:5');
    const decorations = leftRows[0][0].decorations;
    expect(decorations[0]).toMatchObject({ kind: 'device', typeCode: 'num', param: '5' });
  });

  it('parses parameterized device (clsp:AFGHANISTAN)', () => {
    const { leftRows } = parse('rack/v1;br:uk;uk-osm~clsp:AFGHANISTAN');
    const d = leftRows[0][0].decorations[0];
    expect(d).toMatchObject({ kind: 'device', typeCode: 'clsp', param: 'AFGHANISTAN' });
  });

  it('parses mixed flags and devices (canonical order: flags before devices)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-puc~@f:gold.stcb1');
    const decorations = leftRows[0][0].decorations;
    expect(decorations).toHaveLength(2);
    expect(decorations[0].kind).toBe('flag');
    expect(decorations[1].kind).toBe('device');
  });

  it('accepts non-canonical decoration order (devices before flags)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-puc~stcb1.@f:gold');
    const decorations = leftRows[0][0].decorations;
    expect(decorations).toHaveLength(2);
    // order is preserved as-parsed
    expect(decorations[0].kind).toBe('device');
    expect(decorations[1].kind).toBe('flag');
  });

  it('parses V device (vd)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-bsm~vd');
    const d = leftRows[0][0].decorations[0];
    expect(d).toMatchObject({ kind: 'device', typeCode: 'vd' });
  });

  it('parses silver OLC (olcs1)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-bsm~olcs1.olcb2');
    const decorations = leftRows[0][0].decorations;
    expect(decorations[0]).toMatchObject({ kind: 'device', typeCode: 'olc', material: 's', count: 1 });
    expect(decorations[1]).toMatchObject({ kind: 'device', typeCode: 'olc', material: 'b', count: 2 });
  });

  it('parses hourglass devices', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-afrm~hgb.hgs.md');
    const decorations = leftRows[0][0].decorations;
    expect(decorations[0]).toMatchObject({ kind: 'device', typeCode: 'hg', material: 'b' });
    expect(decorations[1]).toMatchObject({ kind: 'device', typeCode: 'hg', material: 's' });
    expect(decorations[2]).toMatchObject({ kind: 'device', typeCode: 'md' });
  });

  it('parses knot clasps (kntb2)', () => {
    const { leftRows } = parse('rack/v1;br:us-army;army-gcm~kntb2');
    const d = leftRows[0][0].decorations[0];
    expect(d).toMatchObject({ kind: 'device', typeCode: 'knt', material: 'b', count: 2 });
  });

  it('skips unknown flag keys with a warning', () => {
    // Should not throw — unknown @z:foo is skipped (§16.18)
    const { leftRows } = parse('rack/v1;br:us-army;army-ndsm~@z:foo');
    expect(leftRows[0][0].decorations).toHaveLength(0);
  });
});

describe('parser — base64url input', () => {
  it('accepts raw input', () => {
    const result = parse('rack/v1;br:us-army;army-ndsm');
    expect(result.version).toBe('rack/v1');
  });
});
