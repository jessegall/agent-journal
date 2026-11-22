import type { InjectionKey } from 'vue';

/** The id a Panel gives its header title, so the panel can name itself from it with aria-labelledby. */
export const panelTitleIdKey: InjectionKey<string> = Symbol('panelTitleId');
