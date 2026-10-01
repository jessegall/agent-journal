export const demo = __DEMO__;

export const NOT_IN_DEMO = "Not in the demo";

export const unlessDemo = (title) => (demo ? NOT_IN_DEMO : title);
