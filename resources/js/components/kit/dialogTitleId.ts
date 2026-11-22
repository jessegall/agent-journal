import type { InjectionKey } from 'vue';

/** The id a Dialog gives its title, so the dialog can name itself from it with aria-labelledby. */
export const dialogTitleIdKey: InjectionKey<string> = Symbol('dialogTitleId');
