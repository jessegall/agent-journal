10. How the viewer reads the declaration

Server (`src/server/viewer/windows_route.py`, and where the response dict is built): add `inspectors` to the `/api/windows` answer, one `InspectorListing` per active module's model (declared or default), with the module fingerprint like windows have, under the same active-module gate. Actions are not inside the listing; they come from the existing buttons catalogue under the model's `row.` slot. The listing carries one flag, `shareable`, from the registry. The panel actions (X, Back, Previous and next, Open, Share) are not in the listing either: `InspectorHead.vue` draws them, as icons, from facts it holds. A module has no way to add one.

```js
// windowCatalogue.js
this.inspectors = shallowRef({});
// in load():
this.inspectors.value = Object.fromEntries(offers.inspectors.map((inspector) => [inspector.noun, inspector]));
// next to window() and sectionsAt():
inspector(noun) {
    return this.inspectors.value[noun] ?? null;
}
```

```vue
<!-- resource/InspectorPanel.vue replaces the switch in ResourcePanel.vue; Inspector.vue is the layout, shared by the overlay and the tasks dialog -->
<script setup>
const declared = computed(() => catalogue.inspector(noun.value));
const row = ref(null);
async function load() {
    const answer = await props.read(fill(declared.value.reads, {row_id: props.id}));
    row.value = answer.ok ? answer.value : null;
}
useResourceEvents(declared.value.events, load);
</script>
<template>
    <InspectorHead :label="fill(declared.label, row)" :title="fill(declared.title, row)" :description="fill(declared.description, row)" :backed="route.stack.length > 1" @close="close" @back="unpeek" />
    <InspectorActions><ButtonSlot :name="`row.${noun}`" :row="{...row, id, noun}" :environment="environment" :read-only="readOnly" @done="load" /></InspectorActions>
    <InspectorTabs :tabs="tabsOf(declared)">
        <InspectorSections :names="partsOf(declared, tab)" :slot-name="`inspector.${noun}`" :row="{...row, id}" />
    </InspectorTabs>
    <InspectorLinks v-if="declared.links" :model="noun" :id="id" :options="declared.links" :read="read" @open="peekRow" />
</template>
```

- **Width.** The overlay sets `width: min(var(--inspector-width), 100vw)` from `INSPECTOR_WIDTHS[declared.width]`. Nothing else in the viewer names a width.
- **Components.** `InspectorSections` gains a `names` prop (the ordered section windows from `components`) and keeps `slot-name` for modules that extend from outside. Each is mounted through `WindowPane`, so trust, allowance and failure are handled as for any window, and is handed the row as `options.row`.
- **Links.** `InspectorLinks.vue` (new, `src/viewer/src/kit/`) is one folding section. The header row reads "Links" with the count (one `link list --page-size 1`, as `PlanLinks.vue` does) and a chevron; the unfold slides open (`max-height` transition, off under reduced motion like the existing `side` transition). Open, it has a fixed height (280px, the value `grouped` already uses), the kind tabs (`Segmented`: All, Documents, Messages, Reports...) pinned at the top and the list scrolling below them. Rows have the same side padding as the body (16px) and no edge-to-edge border, which is the defect in message 108866. The content is `ResourceLinks.vue`, kept as is; `outside-plan` and `page-size` come from the declaration. A row with no links draws no section.
- **Embedded use.** `TasksDialog.vue:152` mounts `TaskInspector` with `stepped` (previous and next task). `Inspector.vue` takes `stepped` and `embedded` props (no veil, no own width) so the dialog keeps its J/K stepping through the same layout.

links: message:108869, message:108866, task:7347, message:108886, message:108887, message:108889, message:108891, message:108892, message:108888, message:108890, plan:1098, message:108905, message:108906, message:108910, message:108911, message:108914, task:7375, message:108915, message:108916, message:108918
