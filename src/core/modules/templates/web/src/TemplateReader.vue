<script setup>
import {computed} from "vue";
import {Btn, Reader, ReaderSection} from "@journal/window-kit";
import {KIND_WORDS, isOwn, partWords, slotsOf} from "./templateForms.js";

// one template read whole: its facts, what it runs at each phase end and its parts. Send it on a row is the primary button; a template a module published says it is not changed
const props = defineProps({template: {type: Object, required: true}});
const emit = defineEmits(["send", "edit"]);
const facts = computed(() => [
    {name: "applies", label: "Applies to", value: props.template.targets.length ? props.template.targets.map((kind) => KIND_WORDS[kind] ?? kind).join(", ") : "Any row"},
    {name: "purpose", label: "Purpose", value: props.template.purpose || "None"},
    {name: "slots", label: "Slots", value: slotsOf(props.template).map((name) => `{${name}}`).join(", ") || "None"},
    {name: "written", label: "Written by", value: props.template.module ? `The ${props.template.module} module` : "A user"},
]);
</script>

<template>
    <Reader :title="template.title" :number="String(template.id)" :abstract="template.brief" :facts="facts" data-template-reader>
        <template #primary>
            <Btn small variant="primary" data-template-send @click="emit('send')">Send it on a row</Btn>
        </template>
        <template #actions>
            <template v-if="isOwn(template)">
                <Btn small data-template-edit @click="emit('edit')">Edit</Btn>
            </template>
        </template>
        <template v-if="!isOwn(template)">
            <p class="fixed" role="note" data-template-fixed>Once made, a template is not changed: make a new one.</p>
        </template>
        <template v-if="template.commands.length">
            <ReaderSection title="Runs at each phase end">
                <template v-for="command in template.commands" :key="command">
                    <p class="command" data-template-command>{{ command }}</p>
                </template>
            </ReaderSection>
        </template>
        <ReaderSection title="Its parts">
            <template v-for="part in template.parts" :key="part">
                <p class="part" data-template-part><strong>{{ partWords(part).heading }}</strong><template v-if="partWords(part).body">
  <span>{{ ` ${partWords(part).body}` }}</span>
</template></p>
            </template>
            <template v-if="!template.parts.length"><p class="part">None</p></template>
        </ReaderSection>
    </Reader>
</template>

<style scoped>
.fixed {
    margin: 12px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.command {
    margin: 0 0 4px;
    font-family: var(--mono, monospace);
    font-size: 12.5px;
}

.part {
    margin: 0 0 6px;
    color: var(--text-2);
    font-size: 13px;
}
</style>
