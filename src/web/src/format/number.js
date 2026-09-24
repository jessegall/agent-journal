export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

export const percent = (n) => `${n * 100}%`;

export const percentBox = (box) => ({left: percent(box.x), top: percent(box.y), width: percent(box.w), height: percent(box.h)});

export const counted = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
