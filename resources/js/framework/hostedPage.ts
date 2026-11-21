import type { Component, PropType } from 'vue';
import { defineComponent, h } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';
import PageHost from './PageHost.vue';

/**
 * The one wrapper made for each declared page's component, so every visit to the page renders the same component and
 * Inertia keeps its state instead of mounting it anew.
 */
const wrappers = new WeakMap<Component, Component>();

/**
 * Wraps a declared page's component so Inertia's page props reach it through the page host as one data prop.
 */
export function hostedPage(component: Component): Component {
    const made = wrappers.get(component);

    if (made !== undefined) {
        return made;
    }

    const wrapper = defineComponent({
        inheritAttrs: false,
        props: { page: { type: Object as PropType<WindowResult<unknown>>, required: true } },
        setup: (props) => () => h(PageHost, { component, page: props.page }),
    });
    wrappers.set(component, wrapper);

    return wrapper;
}
