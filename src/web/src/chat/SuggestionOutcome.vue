<script setup>
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";

defineProps({outcome: {type: Object, required: true}, phone: Boolean});
const emit = defineEmits(["open"]);
</script>

<template>
    <div :class="['sg-outcome', outcome.tone, {phone}]">
        <span class="sg-line">
            <template v-if="outcome.icon">
                <Icon :name="outcome.icon" />
            </template>
            <template v-else>
                <Spinner />
            </template>
            <span>
                {{ outcome.text }}
                <template v-if="outcome.todo">
                    Added
                    <button type="button" class="pill" @click="emit('open', `todo:${outcome.todo}`)">to-do {{ outcome.todo }}</button>
                    {{ outcome.after }}
                </template>
            </span>
        </span>
        <template v-if="outcome.sub">
            <p class="sg-sub">{{ outcome.sub }}</p>
        </template>
        <template v-if="outcome.link">
            <p class="sg-sub">
                <button type="button" class="linkish" @click="emit('open', outcome.link)">Open the plugin's page</button>
            </p>
        </template>
        <template v-if="outcome.quote">
            <p class="sg-quote">{{ outcome.quote }}</p>
        </template>
    </div>
</template>

<style scoped>
.sg-outcome {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
    padding: 9px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    font-size: 12.5px;
}

.sg-line {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    color: var(--text-2);
}

.sg-line > :first-child {
    flex: none;
    margin-top: 3px;
}

.sg-line > span:last-child {
    text-wrap: pretty;
}

.sg-sub {
    margin: 0 0 0 20px;
    color: var(--text-3);
    font-size: 11.5px;
}

.sg-outcome.good {
    border-color: color-mix(in srgb, var(--tone-good) 40%, var(--border-2));
    background: color-mix(in srgb, var(--tone-good) 7%, var(--raised));
}

.sg-outcome.good :deep(svg) {
    color: var(--tone-good);
}

.sg-outcome.bad {
    border-color: color-mix(in srgb, var(--danger) 55%, var(--border-2));
    background: color-mix(in srgb, var(--danger) 8%, var(--raised));
}

.sg-outcome.bad :deep(svg) {
    color: var(--danger);
}

.sg-outcome.busy .sg-line {
    color: var(--accent-text);
}

.sg-outcome.mine {
    border-color: color-mix(in srgb, var(--accent) 50%, var(--border-2));
    background: color-mix(in srgb, var(--accent) 10%, var(--raised));
}

.sg-quote {
    margin: 0 0 0 20px;
    padding-left: 9px;
    border-left: 2px solid color-mix(in srgb, var(--accent) 60%, transparent);
    color: var(--text-2);
    white-space: pre-wrap;
}

.pill {
    display: inline-flex;
    align-items: center;
    padding: 0 7px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-2));
    border-radius: 99px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--text-2);
    font-size: 11px;
    line-height: 1.6;
    cursor: pointer;
}

.pill:hover {
    border-color: var(--accent);
    color: var(--accent-text);
}

.linkish {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.linkish:hover {
    color: var(--text);
}

.sg-outcome.phone {
    border-radius: 12px;
    font-size: 0.882em;
}

.phone .linkish,
.phone .pill {
    min-height: 44px;
}
</style>
