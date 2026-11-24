import type { InjectionKey, Ref } from 'vue';
import type { IconName } from './Icon.vue';

/** One tab as the Tabs component draws it from data. */
export interface TabItem {
    key: string;
    label: string;
    icon?: IconName;
    count?: number;
    closable?: boolean;
}

/** What a Tabs list shares with its tabs: the chosen tab, how to choose or close one, their ids and their look. */
export interface TabsGroup {
    active: Ref<string>;
    select: (value: string) => void;
    close: (value: string) => void;
    tabId: (value: string) => string;
    panelId: (value: string) => string;
    line: Ref<'brand' | 'quiet'>;
    /** Whether each tab keeps a least width of 56 px, as a window's tab strip does; a record's tabs fit their label. */
    hasLeastWidth: Ref<boolean>;
}

export const tabsKey: InjectionKey<TabsGroup> = Symbol('tabs');
