<script setup>
import {computed} from "vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Icon from "../kit/Icon.vue";
import ReadTicks from "../kit/ReadTicks.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {clock} from "../format/time.js";

const props = defineProps({item: {type: Object, required: true}});
const files = computed(() => Object.keys(props.item.files || {}));
const PICTURES = /\.(png|jpe?g|gif|webp)$/i;
const picture = (name) => PICTURES.test(name);
const fileUrl = (name) => `./file/${props.item.type}/${props.item.n}/${encodeURIComponent(name)}`;
const elsewhere = computed(() => props.item.who === "user" && !String(props.item.data?.via || "").startsWith("phone:"));
const faces = computed(() => [...new Set((props.item.reactions || []).map((r) => r.face))]);
const emit = defineEmits(["hold"]);
const HOLD_FOR = 450;
let timer = 0;
const press = () => (timer = setTimeout(() => emit("hold", props.item), HOLD_FOR));
const release = () => clearTimeout(timer);
</script>

<template>
    <SwitchCase :value="item.type">
        <template #question>
            <PhoneQuestion :question="item" />
        </template>
        <template #default>
            <div
                :class="['turn', item.who]"
                @touchstart.passive="press"
                @touchend="release"
                @touchmove.passive="release"
                @contextmenu.prevent="emit('hold', item)"
            >
                <TextDisplay :text="item.brief || item.title" />
                <template v-if="files.length">
                    <span class="turn-files">
                        <template v-for="name in files" :key="name">
                            <a class="turn-file" :href="fileUrl(name)" target="_blank" rel="noopener">
                                <template v-if="picture(name)">
                                    <img class="turn-picture" :src="fileUrl(name)" :alt="name" loading="lazy" />
                                </template>
                                <template v-else>
                                    <Icon name="paperclip" :size="12" />
                                    {{ name }}
                                </template>
                            </a>
                        </template>
                    </span>
                </template>
                <template v-if="faces.length">
                    <span class="turn-faces">{{ faces.join(" ") }}</span>
                </template>
                <span class="turn-meta">
                    <template v-if="elsewhere">from desktop ·</template>
                    {{ clock(item.created) }}
                    <template v-if="item.who === 'user'">
                        <ReadTicks :message="item" />
                    </template>
                </span>
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
.turn {
    max-width: 88%;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    padding: 10px 12px;
    border-radius: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.turn :deep(*) {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

.turn.user {
    align-self: flex-end;
    background: var(--accent-dim);
}

.turn.agent {
    align-self: flex-start;
    background: var(--raised);
}

.turn-faces {
    display: inline-block;
    margin-top: 6px;
    padding: 1px 7px;
    border-radius: 10px;
    background: var(--bg);
    font-size: 14px;
}

.turn-files {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--text-2);
    font-size: 13px;
}

.turn-file {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--accent-text);
}

.turn-picture {
    display: block;
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
}

.turn-meta {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    color: var(--text-3);
    font-size: 11.5px;
}

.turn.agent .turn-meta {
    justify-content: flex-start;
}
</style>
