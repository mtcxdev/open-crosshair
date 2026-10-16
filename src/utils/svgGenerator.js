/**
 * Vector SVG Crosshair Generator
 * Generates mathematically crisp, pixel-accurate vector crosshairs from layer configuration.
 */

export function generateCrosshairSVG(config, options = {}) {
  const {
    bloom = 0,
    isFiring = false,
    viewBoxSize = 128,
  } = options;

  const center = viewBoxSize / 2;
  const scale = config.scale || 1.0;
  const rotation = config.rotation || 0;
  const offsetX = (config.offsetX || 0) * scale;
  const offsetY = (config.offsetY || 0) * scale;
  const globalOpacity = config.opacity !== undefined ? config.opacity : 1.0;

  const elements = [];

  // Shadow filter definition if enabled
  const filterId = `crosshair-filter-${Math.random().toString(36).substr(2, 9)}`;
  let defs = '';
  if (config.shadow?.enabled) {
    const blur = config.shadow.blur || 2;
    const shadowColor = config.shadow.color || 'rgba(0,0,0,0.8)';
    defs = `
      <defs>
        <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="${blur}" flood-color="${shadowColor}" />
        </filter>
      </defs>
    `;
  }

  // 1. Ring Layer
  if (config.layers?.ring?.enabled) {
    const ring = config.layers.ring;
    const ringRadius = (ring.radius || 12) + (bloom * 0.5);
    const strokeWidth = ring.thickness || 2;
    const color = ring.color || '#00FF66';
    const fill = ring.fill ? (ring.fillColor || color) : 'none';
    const fillOpacity = ring.fill ? (ring.fillOpacity !== undefined ? ring.fillOpacity : 0.2) : 0;
    const strokeDasharray = ring.dashed ? `${ring.dashLength || 4} ${ring.dashSpace || 4}` : undefined;

    // Optional ring outline
    if (ring.outline) {
      const oWidth = strokeWidth + (ring.outlineWidth || 1) * 2;
      elements.push(`
        <circle
          cx="${center}"
          cy="${center}"
          r="${ringRadius}"
          fill="none"
          stroke="${ring.outlineColor || '#000000'}"
          stroke-width="${oWidth}"
          ${strokeDasharray ? `stroke-dasharray="${strokeDasharray}"` : ''}
        />
      `);
    }

    elements.push(`
      <circle
        cx="${center}"
        cy="${center}"
        r="${ringRadius}"
        fill="${fill}"
        fill-opacity="${fillOpacity}"
        stroke="${color}"
        stroke-width="${strokeWidth}"
        ${strokeDasharray ? `stroke-dasharray="${strokeDasharray}"` : ''}
      />
    `);
  }

  // 2. Crosshair Lines / Arms
  if (config.layers?.lines?.enabled) {
    const lines = config.layers.lines;
    const gap = (lines.gap || 6) + bloom;
    const length = lines.length || 10;
    const thickness = lines.thickness || 2;
    const color = lines.color || '#00FF66';
    const radius = lines.borderRadius || 0;
    const outline = lines.outline;
    const outlineColor = lines.outlineColor || '#000000';
    const outlineWidth = lines.outlineWidth || 1;

    const arms = [
      { id: 'top', enabled: lines.tShape ? false : lines.top !== false, x: center - thickness / 2, y: center - gap - length, w: thickness, h: length },
      { id: 'bottom', enabled: lines.bottom !== false, x: center - thickness / 2, y: center + gap, w: thickness, h: length },
      { id: 'left', enabled: lines.left !== false, x: center - gap - length, y: center - thickness / 2, w: length, h: thickness },
      { id: 'right', enabled: lines.right !== false, x: center + gap, y: center - thickness / 2, w: length, h: thickness },
    ];

    // Render line outlines first
    if (outline) {
      arms.forEach(arm => {
        if (!arm.enabled) return;
        const ow = outlineWidth;
        elements.push(`
          <rect
            x="${arm.x - ow}"
            y="${arm.y - ow}"
            width="${arm.w + ow * 2}"
            height="${arm.h + ow * 2}"
            rx="${radius ? radius + ow : 0}"
            fill="${outlineColor}"
          />
        `);
      });
    }

    // Render lines
    arms.forEach(arm => {
      if (!arm.enabled) return;
      elements.push(`
        <rect
          x="${arm.x}"
          y="${arm.y}"
          width="${arm.w}"
          height="${arm.h}"
          rx="${radius}"
          fill="${color}"
        />
      `);
    });
  }

  // 3. Chevron / Triangles
  if (config.layers?.chevron?.enabled) {
    const ch = config.layers.chevron;
    const chSize = ch.size || 8;
    const chThick = ch.thickness || 2;
    const color = ch.color || '#00FF66';
    const chOffsetY = ch.offsetY || 0;
    const inverted = ch.inverted || false;

    // Triangle points
    const topY = inverted ? center + chOffsetY + chSize : center + chOffsetY - chSize;
    const bottomY = inverted ? center + chOffsetY - chSize : center + chOffsetY + chSize;
    const leftX = center - chSize;
    const rightX = center + chSize;

    if (ch.outline) {
      const ow = ch.outlineWidth || 1;
      elements.push(`
        <polyline
          points="${leftX - ow},${bottomY + ow} ${center},${topY - ow} ${rightX + ow},${bottomY + ow}"
          fill="none"
          stroke="${ch.outlineColor || '#000000'}"
          stroke-width="${chThick + ow * 2}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      `);
    }

    elements.push(`
      <polyline
        points="${leftX},${bottomY} ${center},${topY} ${rightX},${bottomY}"
        fill="none"
        stroke="${color}"
        stroke-width="${chThick}"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    `);
  }

  // 4. Center Dot
  if (config.layers?.dot?.enabled) {
    const dot = config.layers.dot;
    const dotSize = dot.size || 2;
    const color = dot.color || '#00FF66';
    const isSquare = dot.shape === 'square';

    if (isSquare) {
      if (dot.outline) {
        const ow = dot.outlineWidth || 1;
        elements.push(`
          <rect
            x="${center - dotSize - ow}"
            y="${center - dotSize - ow}"
            width="${(dotSize + ow) * 2}"
            height="${(dotSize + ow) * 2}"
            fill="${dot.outlineColor || '#000000'}"
          />
        `);
      }
      elements.push(`
        <rect
          x="${center - dotSize}"
          y="${center - dotSize}"
          width="${dotSize * 2}"
          height="${dotSize * 2}"
          fill="${color}"
        />
      `);
    } else {
      if (dot.outline) {
        const ow = dot.outlineWidth || 1;
        elements.push(`
          <circle
            cx="${center}"
            cy="${center}"
            r="${dotSize + ow}"
            fill="${dot.outlineColor || '#000000'}"
          />
        `);
      }
      elements.push(`
        <circle
          cx="${center}"
          cy="${center}"
          r="${dotSize}"
          fill="${color}"
        />
      `);
    }
  }

  const transform = `translate(${offsetX}, ${offsetY}) rotate(${rotation}, ${center}, ${center}) scale(${scale})`;
  const filterAttr = config.shadow?.enabled ? `filter="url(#${filterId})"` : '';

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${viewBoxSize} ${viewBoxSize}"
      width="${viewBoxSize}"
      height="${viewBoxSize}"
      style="overflow: visible; opacity: ${globalOpacity};"
    >
      ${defs}
      <g transform="${transform}" transform-origin="${center} ${center}" ${filterAttr}>
        ${elements.join('\n')}
      </g>
    </svg>
  `.trim();
}
