import type { Component, PropType } from 'vue';
import { defineComponent, h } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';
import PageHost from './PageHost.vue';

/**
 * Wraps a declared page's component so Inertia's page props reach it through the page host as one data prop.
 */
export function hostedPage(component: Component): Component {
    return defineComponent({
        inheritAttrs: false,
        props: { page: { type: Object as PropType<WindowResult<unknown>>, required: true } },
        setup: (props) => () => h(PageHost, { component, page: props.page }),
    });
}
