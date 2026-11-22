import type { InjectionKey, Ref } from 'vue';

/** Where a Tree moves the focus from the item that asks. */
export type TreeMove = 'next' | 'previous' | 'first' | 'last' | 'child' | 'parent';

/** What a Tree shares with its items: the one item in the tab order and the way to move the focus. */
export interface TreeGroup {
    active: Ref<string | undefined>;
    move: (from: HTMLElement, to: TreeMove) => void;
}

export const treeKey: InjectionKey<TreeGroup> = Symbol('tree');
