<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

defineProps({revisions: {type: Object, required: true}});
</script>

<template>
    <nav class="revision-strip" aria-label="Revisions">
        <div class="steps">
            <template v-if="revisions.count > 1">
                <Btn kind="icon" small :disabled="revisions.at <= 0" title="Earlier revision" @click="revisions.go(revisions.at - 1)">
                    <Icon name="chevronRight" class="back" />
                </Btn>
                <template v-if="revisions.hidden > 0">
                    <span class="earlier">+{{ revisions.hidden }}</span>
                </template>
                <template v-for="i in revisions.indexes" :key="i">
                    <button
                        type="button"
                        :class="['tick', {current: i === revisions.at, open: revisions.open && i === revisions.count - 1}]"
                        :title="revisions.open && i === revisions.count - 1 ? `Revision ${i + 1}, open for edits` : `Revision ${i + 1}`"
                        :aria-current="i === revisions.at ? 'true' : undefined"
                        @click="revisions.go(i)"
                    />
                </template>
                <Btn kind="icon" small :disabled="revisions.latest" title="Later revision" @click="revisions.go(revisions.at + 1)">
                    <Icon name="chevronRight" />
                </Btn>
                <span class="count">Revision {{ revisions.at + 1 }} of {{ revisions.count }}</span>
            </template>
            <template v-else>
                <span class="count">{{ revisions.status || "Kept" }}</span>
            </template>
            <span class="grow" />
            <template v-if="revisions.latest && revisions.open">
                <Btn small title="Keep this revision as it is; the next edit starts a new one" @click="revisions.keep()">
                    Keep this revision
                </Btn>
            </template>
            <template v-if="revisions.at > 0">
                <button
                    type="button"
                    :class="['changes', {on: revisions.changes}]"
                    :aria-pressed="revisions.changes"
                    @click="revisions.changes = !revisions.changes"
                >
                    Show changes
                </button>
            </template>
            <template v-if="!revisions.latest">
                <Btn small @click="revisions.go(revisions.count - 1)">Latest</Btn>
            </template>
        </div>
        <template v-if="revisions.count > 1">
            <p class="note">{{ revisions.note }}</p>
        </template>
        <template v-if="revisions.error">
            <span class="error">{{ revisions.error }}</span>
        </template>
    </nav>
</template>

<style scoped>
.revision-strip {
    margin: 12px 0 6px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-3);
    font-size: 12px;
}

.steps {
    display: flex;
    align-items: center;
    gap: 4px;
}

.grow {
    flex: 1;
}

.earlier {
    margin-right: 2px;
    color: var(--text-3);
    font-size: 11px;
}

.count {
    margin-left: 6px;
    color: var(--text-2);
    white-space: nowrap;
}

.back {
    transform: rotate(180deg);
}

.tick {
    flex: none;
    width: 8px;
    height: 16px;
    margin: 0 1px;
    padding: 0;
    border: none;
    border-radius: 3px;
    background: var(--border-2);
    cursor: pointer;
}

.tick:hover {
    background: var(--text-3);
}

.tick.current {
    background: var(--accent);
}

.tick.open {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px var(--text-3);
}

.tick.open.current {
    box-shadow: inset 0 0 0 1.5px var(--accent);
}

.note {
    margin: 6px 0 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.changes {
    flex: none;
    height: 24px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: transparent;
    color: var(--text-3);
    font-size: 11.5px;
    white-space: nowrap;
    cursor: pointer;
}

.changes.on {
    border-color: var(--accent);
    color: var(--accent-text);
}

.error {
    display: block;
    color: var(--danger);
    font-size: 12px;
}
</style>
