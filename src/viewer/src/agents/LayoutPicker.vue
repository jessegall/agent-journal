<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import PresetList from "../kit/PresetList.vue";
import {matches, thumbnail} from "../domain/panes.js";

const props = defineProps({presets: {type: Array, required: true}, layout: {type: Object, default: null}, tip: {type: String, required: true}});
const emit = defineEmits(["pick"]);
const open = ref(false);
const opener = ref(null);
const listed = computed(() => props.presets.map((p) => ({...p, cells: thumbnail(p.shape), current: props.layout ? matches(props.layout, p.shape) : false})));

function pick(key) {
    open.value = false;
    emit("pick", props.presets.find((p) => p.key === key).shape);
}
</script>

<template>
    <span ref="opener">
        <Btn small v-tip="tip" @click.stop="open = !open">
            <Icon name="layout" :size="12" />
            Change layout
        </Btn>
    </span>
    <template v-if="open">
        <MenuPanel :anchor="opener" align="end" :min-width="240" :max-width="300" @click.stop @close="open = false">
            <PresetList :presets="listed" @pick="pick" />
        </MenuPanel>
    </template>
</template>
