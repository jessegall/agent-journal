import type { Component } from 'vue';
import { defineAsyncComponent } from 'vue';
import { components } from '@/generated/ui-manifest';

const loaded = new Map<string, Component>();

/**
 * The component the UI manifest lists under this name, loaded when first shown and made once, so every visit renders
 * the same component.
 */
export function componentNamed(name: string): Component {
    const known = loaded.get(name);

    if (known !== undefined) {
        return known;
    }

    const component = defineAsyncComponent(
        async () => (await components[name]()).default as Component,
    );
    loaded.set(name, component);

    return component;
}
