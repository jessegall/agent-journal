<script setup>
import Btn from "../kit/Btn.vue";
import CopyButton from "../kit/CopyButton.vue";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {endsOf, linkMessage} from "../composables/shares.js";

defineProps({made: {type: Object, required: true}, tunnel: {type: String, default: ""}, title: {type: String, default: ""}});
const emit = defineEmits(["check-again"]);
</script>

<template>
    <SwitchCase :value="tunnel">
        <template #starting>
            <div class="starting">
                <Spinner />
                <span>
                    Getting the link ready…
                    <span class="meta">Usually a few seconds.</span>
                </span>
            </div>
        </template>
        <template #default>
            <div class="made">
                <template v-if="tunnel === 'late'">
                    <span class="made-head late">
                        <Icon name="warn" :size="12" />
                        The link isn't reachable yet
                    </span>
                </template>
                <template v-else>
                    <span class="made-head">
                        <Icon name="tick" :size="12" />
                        Anyone with this link can view it
                    </span>
                </template>
                <div class="link-row">
                    <input class="link" :value="made.abstract" readonly @focus="$event.target.select()" />
                    <CopyButton :text="made.abstract" label="Copy" />
                    <CopyButton
                        :text="linkMessage(title, made.abstract)"
                        icon="chat"
                        label="Copy with message"
                        hint="Copy the link with a short description"
                    />
                </div>
                <template v-if="tunnel === 'late'">
                    <div class="late-row">
                        <span class="meta">It was made, but it doesn't open from outside yet.</span>
                        <Btn small @click="emit('check-again')">Check again</Btn>
                    </div>
                </template>
                <span class="meta">
                    {{ endsOf(made) === "never ends" ? "It never ends" : `It ${endsOf(made)}` }} · stop it under Open links
                </span>
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
.made-head.late {
    color: var(--tone-warn);
}

.late-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.quiet,
.meta {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.made {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.made-head {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--tone-good);
    font-size: 12.5px;
    font-weight: 500;
}

.link-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.link-row .link {
    flex: 1 1 220px;
}

.starting {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font-size: 13px;
}

.starting .meta {
    display: block;
    margin-top: 2px;
}

.late {
    margin: 0;
    color: var(--tone-warn);
    font-size: 12px;
    line-height: 1.5;
}

.link {
    flex: 1;
    min-width: 0;
    height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text);
    font-family: var(--mono, ui-monospace, monospace);
    font-size: 12px;
}

.link-row :deep(.copy-button) {
    height: 30px;
}
</style>
