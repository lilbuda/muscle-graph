import { getAnatomy } from './advanced-geometry.js';
import { getMuscleLabel, getMuscleParents, MuscleType } from './muscles.js';
import type { BodyType, ModelType } from './types.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
let nextModelId = 0;

const FEMALE_HEAD_SCALE = 0.8;
const FEMALE_HEAD_BASE = 250;

const maleFootFit = {
  anterior: { sourceY: 1382, targetY: 1293, centerX: 321, leftX: 16, rightX: 70 },
  posterior: { sourceY: 1375, targetY: 1288, centerX: 1143, leftX: -85.5, rightX: -33.5 },
} as const;

function femaleFit(type: ModelType): { figure: string; head: string } {
  const front = type === 'anterior';
  // Express each upstream viewport in the male 724 × 1448 display frame.
  const viewportScale = front ? 1448 / 1538 : 724 / 774;
  const viewportOffset = front ? 40 * viewportScale : (1448 - 1448 * viewportScale) / 2;
  const targetCrown = front ? 96 : 97;
  const targetSole = front ? 1340 : 1342;
  const sourceCrown = FEMALE_HEAD_BASE * (1 - FEMALE_HEAD_SCALE);
  const sourceSole = 1429;
  const scale = (targetSole - targetCrown) / (viewportScale * (sourceSole - sourceCrown));
  const translateY = (targetCrown - viewportOffset) / viewportScale - scale * sourceCrown;
  const centerX = front ? 321 : 1143;
  return {
    figure: `translate(${centerX * (1 - scale)} ${translateY}) scale(${scale})`,
    head: `translate(${centerX} ${FEMALE_HEAD_BASE}) scale(${FEMALE_HEAD_SCALE}) translate(${-centerX} ${-FEMALE_HEAD_BASE})`,
  };
}

export function createModelSvg(bodyType: BodyType, type: ModelType, ariaLabel: string, document: Document = globalThis.document): SVGSVGElement {
  function pathElement(d: string, className: string): SVGPathElement {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', className);
    path.setAttribute('d', d);
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    return path;
  }

  const anatomy = getAnatomy(bodyType, type);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'mg-svg');
  svg.setAttribute('viewBox', anatomy.viewBox);
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', ariaLabel);
  svg.dataset.bodyType = bodyType;
  svg.dataset.type = type;

  const modelId = nextModelId++;
  const defs = document.createElementNS(SVG_NS, 'defs');
  svg.append(defs);
  const rectangleClip = (name: string, x: number, y: number, width: number, height: number): string => {
    const clip = document.createElementNS(SVG_NS, 'clipPath');
    clip.id = `mg-${modelId}-${name}`;
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', String(x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('width', String(width));
    rect.setAttribute('height', String(height));
    clip.append(rect);
    defs.append(clip);
    return `url(#${clip.id})`;
  };
  const fit = bodyType === 'female' ? femaleFit(type) : undefined;
  const footFit = bodyType === 'male' ? maleFootFit[type] : undefined;
  const femaleAnatomy = footFit ? getAnatomy('female', type) : undefined;
  const footPaths = femaleAnatomy?.regions.find(region => region.muscle === MuscleType.FEET)?.paths;
  const footClips = footFit ? {
    body: rectangleClip('outline-body', -2000, -2000, 5000, footFit.targetY + 2000),
    left: rectangleClip('foot-left', -2000, footFit.sourceY, footFit.centerX + 2000, 2000),
    right: rectangleClip('foot-right', footFit.centerX, footFit.sourceY, 2000, 2000),
  } : undefined;
  const figure = document.createElementNS(SVG_NS, 'g');
  figure.setAttribute('class', 'mg-figure');
  if (fit) figure.setAttribute('transform', fit.figure);
  svg.append(figure);

  const outline = pathElement(anatomy.silhouette, 'mg-outline');
  outline.setAttribute('aria-hidden', 'true');
  figure.append(outline);
  if (fit) {
    // Fit the head portion of the original border along with the head artwork.
    outline.setAttribute('clip-path', rectangleClip('outline-body', -2000, FEMALE_HEAD_BASE, 5000, 2000));
    const headBorder = outline.cloneNode() as SVGPathElement;
    headBorder.setAttribute('clip-path', rectangleClip('outline-head', -2000, -2000, 5000, FEMALE_HEAD_BASE + 2000));
    headBorder.setAttribute('transform', fit.head);
    figure.append(headBorder);
  }
  if (footFit && footClips && femaleAnatomy) {
    outline.setAttribute('clip-path', footClips.body);
    for (const side of ['left', 'right'] as const) {
      const border = pathElement(femaleAnatomy.silhouette, 'mg-outline');
      border.setAttribute('aria-hidden', 'true');
      border.setAttribute('clip-path', footClips[side]);
      border.setAttribute('transform', `translate(${footFit[`${side}X`]} ${footFit.targetY - footFit.sourceY})`);
      figure.append(border);
    }
  }

  for (const entry of anatomy.regions) {
    const group = document.createElementNS(SVG_NS, 'g');
    const label = getMuscleLabel(entry.muscle);
    group.setAttribute('class', 'mg-muscle');
    group.dataset.muscle = entry.muscle;
    group.dataset.muscleGroups = getMuscleParents(entry.muscle).join(' ');
    group.setAttribute('aria-label', label);
    if (footClips && type === 'posterior' && entry.muscle === MuscleType.ANKLES) {
      group.setAttribute('clip-path', footClips.body);
    }
    const title = document.createElementNS(SVG_NS, 'title');
    title.textContent = label;
    group.append(title);
    let parts = group;
    if (fit && (entry.muscle === MuscleType.HEAD || entry.muscle === MuscleType.HAIR)) {
      parts = document.createElementNS(SVG_NS, 'g');
      parts.setAttribute('transform', fit.head);
      group.append(parts);
    }
    const useFemaleFeet = footFit && footClips && footPaths && entry.muscle === MuscleType.FEET;
    const paths = useFemaleFeet ? footPaths : entry.paths;
    for (const [index, d] of paths.entries()) {
      const mask = entry.clips[index];
      const path = pathElement(mask ?? d, 'mg-muscle-part');
      if (useFemaleFeet) {
        const side = index < paths.length / 2 ? 'left' : 'right';
        path.setAttribute('transform', `translate(${footFit[`${side}X`]} ${footFit.targetY - footFit.sourceY})`);
        path.setAttribute('clip-path', footClips[side]);
      }
      if (mask) {
        const clip = document.createElementNS(SVG_NS, 'clipPath');
        clip.id = `mg-${modelId}-${entry.muscle}-${index}`;
        clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
        clip.append(pathElement(d, 'mg-source-contour'));
        defs.append(clip);
        path.setAttribute('clip-path', `url(#${clip.id})`);
      }
      parts.append(path);
    }
    figure.append(group);
  }
  return svg;
}
