<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({
    made: {type: Object, default: null},
    row: {type: Object, default: null},
    making: {type: String, default: ""},
    icon: {type: String, default: "file"},
    open: {type: Boolean, default: false},
    added: {type: Boolean, default: false},
});
const emit = defineEmits(["toggle", "keep", "leave", "close"]);
</script>

<template>
    <template v-if="making">
        <div class="dump-made-row writing">
            <span class="dump-shimmer" />
            <span class="dump-made-head">
                <span class="dump-made-icon" />
                <span class="dump-made-text">
                    <span class="dump-made-title">Processing · {{ making }}</span>
                    <span class="dump-bone" />
                </span>
            </span>
        </div>
    </template>
    <template v-else>
        <div :class="['dump-made-row', {writing: made.writing, open, left: made.left}]">
            <template v-if="made.writing">
                <span class="dump-shimmer" />
            </template>
            <button type="button" class="dump-made-head" @click="emit('toggle')">
                <span class="dump-made-icon"><Icon :name="icon" :size="12" /></span>
                <span class="dump-made-text">
                    <span class="dump-made-title">{{ row?.title || `${made.type} ${made.n}` }}</span>
                    <template v-if="row?.abstract">
                        <TextDisplay inline class="dump-made-line" :text="row.abstract" />
                    </template>
                </span>
                <template v-if="!made.left">
                    <span class="dump-tag">{{ made.type }} {{ made.n }}</span>
                </template>
            </button>
            <template v-if="made.left">
                <button type="button" class="dump-put-back" @click="emit('keep')">Left out · Put back</button>
            </template>
            <template v-if="open && row">
                <div class="dump-made-open">
                    <template v-if="row.brief">
                        <TextDisplay class="dump-lead" :text="row.brief" />
                    </template>
                    <template v-for="s in row.sections || []" :key="s.title">
                        <div class="dump-part">
                            <span class="dump-part-label">{{ s.title }}</span>
                            <TextDisplay inline class="dump-part-text" :text="s.body" />
                        </div>
                    </template>
                    <div class="dump-made-foot">
                        <span class="dump-from">{{ made.from }}</span>
                        <template v-if="!added">
                            <Btn small kind="danger" title="Drop this and keep it out of the journal" @click="emit('leave')">Leave out</Btn>
                        </template>
                        <Btn small @click="emit('close')">Close</Btn>
                    </div>
                </div>
            </template>
        </div>
    </template>
</template>

<style scoped>
.dump-made-row {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
}

.dump-made-row.writing {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
}

.dump-made-row.open {
    border-color: var(--border-3);
}

.dump-made-row.left .dump-made-head {
    opacity: 0.45;
    cursor: default;
}

.dump-shimmer {
    position: absolute;
    inset: 0;
    border-radius: 9px;
    background: linear-gradient(100deg, transparent 18%, color-mix(in srgb, var(--accent) 18%, transparent) 50%, transparent 82%);
    background-size: 200% 100%;
    pointer-events: none;
    animation: dump-shim 1.8s ease-in-out infinite;
    display: none;
}

.dump-made-head {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 40px;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.dump-made-row.writing .dump-made-head {
    cursor: default;
}

.dump-made-icon {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: var(--accent-dim);
    color: var(--accent-text);
}

.dump-made-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    text-align: left;
}

.dump-made-line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--text-3);
    font-size: 11.5px;
}

.dump-made-title {
    color: var(--text);
    font-size: 12.5px;
}

.dump-made-row.writing .dump-made-title {
    color: var(--accent-text);
}

.dump-made-row.left .dump-made-title {
    text-decoration: line-through;
}

.dump-bone {
    display: block;
    width: 58%;
    height: 7px;
    margin-top: 3px;
    border-radius: 3px;
    background: var(--border);
}

.dump-tag {
    flex: none;
    color: var(--text-4);
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.dump-put-back {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border: none;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
}

.dump-put-back:hover {
    color: var(--text);
}

.dump-made-open {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 12px 12px;
    border-top: 1px solid var(--line);
    background: var(--bg);
    animation: dump-fadein 0.2s ease-out;
}

.dump-part-text {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
    white-space: pre-line;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.dump-lead {
    margin: 10px 0 0;
    -webkit-line-clamp: 6;
}

.dump-part {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.dump-part-label {
    color: var(--text-4);
    font-size: 10.5px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
}

.dump-from {
    min-width: 0;
    overflow: hidden;
    color: var(--text-4);
    font-size: 11.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
}

.dump-made-foot {
    display: flex;
    align-items: center;
    gap: 8px;
}

@keyframes dump-shim {
    from {
        background-position: 130% 0;
    }

    to {
        background-position: -30% 0;
    }
}

@keyframes dump-fadein {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
