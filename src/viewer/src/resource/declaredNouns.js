import {shallowReactive} from "vue";

// the nouns whose inspector the shared layout draws; every other noun is still drawn by its own branch of the side panel
export const DECLARED_NOUNS = shallowReactive(new Set());
