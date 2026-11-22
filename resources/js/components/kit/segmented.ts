import type { InjectionKey, Ref } from 'vue';

/** What a SegmentedControl shares with its items: the chosen value and the way to choose one. */
export interface SegmentedGroup {
    chosen: Ref<string>;
    choose: (value: string) => void;
}

export const segmentedKey: InjectionKey<SegmentedGroup> = Symbol('segmented');
