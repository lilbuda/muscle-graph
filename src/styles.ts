export const baseStyles = `
.mg-wrapper {
  --mg-body-color: #879297;
  --mg-body-fill-color: transparent;
  --mg-outline-color: #ffffff;
  --mg-body-outline-color: #dfdfdf;
  --mg-hover-color: #dc2626;
  --mg-background-color: transparent;
  box-sizing: border-box;
  display: inline-flex;
  width: min(100%, 22rem);
  padding: 0.25rem;
  border-radius: 1.25rem;
  background: var(--mg-background-color);
  line-height: 1;
}

.mg-wrapper *, .mg-wrapper *::before, .mg-wrapper *::after { box-sizing: inherit; }
.mg-svg { display: block; width: 100%; height: auto; aspect-ratio: 1 / 2; }
.mg-muscle { cursor: default; outline: none; }
.mg-muscle[role="button"] { cursor: pointer; }
.mg-outline {
  fill: var(--mg-body-fill-color);
  stroke: var(--mg-body-outline-color);
  stroke-width: 2;
  stroke-linecap: butt;
  stroke-linejoin: round;
  pointer-events: none;
}
.mg-muscle-part {
  fill: var(--mg-fill, var(--mg-body-color));
  stroke: var(--mg-outline-color);
  stroke-width: 1.15;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.mg-muscle[role="button"]:hover .mg-muscle-part, .mg-muscle[role="button"]:focus-visible .mg-muscle-part {
  fill: var(--mg-hover-color);
  stroke: var(--mg-hover-color);
  stroke-width: 1.6;
}
.mg-muscle[role="button"]:focus-visible { outline: 2px solid transparent; }
`;
