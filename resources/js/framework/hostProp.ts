import { inject, provide } from 'vue';

const HOST_PROP = Symbol('journal.host-prop');

/**
 * Marks everything under a window or section host as fed by this prop, so a form inside it asks the server for this
 * prop alone after it sends.
 */
export function provideHostProp(propName: string): void {
    provide(HOST_PROP, propName);
}

/**
 * The prop of the host this component is drawn in; a page of its own is fed by its page prop.
 */
export function useHostProp(): string {
    return inject<string>(HOST_PROP, 'page');
}
