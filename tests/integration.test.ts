import { describe, it, expect } from 'vitest';
import { renderSpec } from '../src/index.js';

function isSVG(s: string): boolean {
  return s.trimStart().startsWith('<svg') && s.includes('viewBox') && s.includes('</svg>');
}

describe('integration — spec §18 examples', () => {
  it('§18.1 US Army service uniform (partial — stub ribbons only)', () => {
    // Reduced to ribbons in the stub registry
    const spec = 'rack/v1;br:us-army;ut:service;rw:3;tx:grille;army-msm|army-bsm~olcb1.vd,army-ph,army-arcom~olcb2|army-gcm~kntb2,army-ndsm,army-gwots;army-puc~@f:gold';
    const svg = renderSpec(spec);
    expect(isSVG(svg)).toBe(true);
    // Should contain stripe rects
    expect(svg).toContain('<rect');
    // Should contain the V device (letter text)
    expect(svg).toContain('>V<');
    // Should have right-breast block (army-puc with gold frame)
    expect(svg).toContain('stroke="#C5A028"');
  });

  it('§18.6 Armed Forces Reserve Medal with hourglasses', () => {
    const spec = 'rack/v1;br:us-army;ut:service;army-afrm~hgb.hgs.md';
    const svg = renderSpec(spec);
    expect(isSVG(svg)).toBe(true);
    // Hourglass uses <path>
    expect(svg).toContain('<path');
    // M device uses <text>
    expect(svg).toContain('>M<');
  });

  it('§18.10 custom inline ribbon with campaign star', () => {
    const spec = 'rack/v1;br:us-army;ut:service;rw:3;army-msm,[$imperial-blue=4_#FFFFFF=1_$old-glory-red=4_#FFFFFF=1_$imperial-blue=4]~stcb1,army-bsm';
    const svg = renderSpec(spec);
    expect(isSVG(svg)).toBe(true);
    // Inline spec colors should appear in output
    expect(svg).toContain('#004B8D');  // imperial-blue
    expect(svg).toContain('#BF0A30');  // old-glory-red
    // Campaign star is a polygon
    expect(svg).toContain('<polygon');
  });

  it('§18.2 US Navy top-3 mode', () => {
    const spec = 'rack/v1;br:us-navy;ut:service;dm:top3;navy-achievement~stg1.vd';
    const svg = renderSpec(spec);
    expect(isSVG(svg)).toBe(true);
    // V device
    expect(svg).toContain('>V<');
    // Gold star polygon
    expect(svg).toContain('<polygon');
  });

  it('NATO medal with clasp', () => {
    const spec = 'rack/v1;br:us-army;nato-medal~clsp:ISAF';
    const svg = renderSpec(spec);
    expect(isSVG(svg)).toBe(true);
    // Clasp label
    expect(svg).toContain('ISAF');
  });
});

describe('integration — output structure', () => {
  it('SVG has correct namespace', () => {
    const svg = renderSpec('rack/v1;br:us-army;army-ndsm');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('SVG has a viewBox attribute', () => {
    const svg = renderSpec('rack/v1;br:us-army;army-ndsm');
    expect(svg).toMatch(/viewBox="[\d. ]+"/);
  });

  it('multi-row rack produces ribbons for each row', () => {
    const svg = renderSpec('rack/v1;br:us-army;army-ndsm|army-bsm,army-ph,army-arcom');
    // 4 total ribbons → at least 4 <g> groups
    const gCount = (svg.match(/<g/g) ?? []).length;
    expect(gCount).toBeGreaterThanOrEqual(4);
  });

  it('renders unknown ribbon as #CCCCCC placeholder', () => {
    const svg = renderSpec('rack/v1;br:us-army;totally-unknown-ribbon-xyz');
    expect(svg).toContain('#CCCCCC');
  });

  it('scale option changes output dimensions', () => {
    const svg48 = renderSpec('rack/v1;br:us-army;army-ndsm', { scale: 48 });
    const svg96 = renderSpec('rack/v1;br:us-army;army-ndsm', { scale: 96 });
    const match48 = svg48.match(/width="(\d+)"/);
    const match96 = svg96.match(/width="(\d+)"/);
    expect(Number(match48?.[1])).toBeLessThan(Number(match96?.[1]));
  });

  it('custom registry entry overrides built-in', () => {
    const svg = renderSpec('rack/v1;br:us-army;army-bsm', {
      registry: [{
        id: 'army-bsm',
        name: 'Custom Override',
        branch: ['us-army'],
        stripes: [{ color: '#FF00FF', width: 1 }],
      }],
    });
    expect(svg).toContain('#FF00FF');
  });
});

describe('integration — error cases', () => {
  it('throws RackSpecParseError for missing br', () => {
    expect(() => renderSpec('rack/v1;ut:service;army-ndsm')).toThrow('br');
  });

  it('throws RackSpecParseError for unknown version', () => {
    expect(() => renderSpec('rack/v2;br:us-army;army-ndsm')).toThrow();
  });
});
