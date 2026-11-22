import type { InjectionKey, Ref } from 'vue';

/** The id of the option a ListBox shows as active, which a MenuItem in option mode reads to draw its active look. */
export const listBoxActiveKey: InjectionKey<Ref<string | null>> = Symbol('listBoxActive');
