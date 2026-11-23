import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';

/**
 * Opens a project file in its own window on the desk, by its path from the project's root.
 */
export type FileOpener = (path: string) => void;

const FILE_OPENER: InjectionKey<FileOpener> = Symbol('journal.file-opener');

/**
 * Lets every window under this desk open a project file as a window of its own.
 */
export function provideFileOpener(opener: FileOpener): void {
    provide(FILE_OPENER, opener);
}

/**
 * The desk's way to open a project file; a window shown on its own page, with no desk around it, opens nothing.
 */
export function useFileOpener(): FileOpener {
    return inject(FILE_OPENER, () => undefined);
}
