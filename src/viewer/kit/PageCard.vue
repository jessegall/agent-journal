<script setup>
import Icon from "../src/kit/Icon.vue";

// the one card of a card page, the body Plugin, Secret and Check cards share: its icon and name, one state line, one line of what it is,
// a fault line when it has one, then the foot with the one action that waits on the left and the actions menu on the right.
// Every card has the same lines in the same places; a switch or a mark goes in the corner slot.
defineProps({
    title: {type: String, required: true},
    icon: {type: String, default: ""},
    state: {type: String, default: ""},
    line: {type: String, default: ""},
    fault: {type: String, default: ""},
});
</script>

<template>
    <article class="page-card" data-page-card>
        <header class="page-card-head">
            <span v-if="icon" class="page-card-mark" aria-hidden="true"><Icon :name="icon" :size="16" /></span>
            <span class="page-card-names">
                <h3 class="page-card-title" :title="title">{{ title }}</h3>
                <p class="page-card-state" data-card-state>{{ state || "—" }}</p>
            </span>
            <span v-if="$slots.corner" class="page-card-corner" data-card-corner><slot name="corner" /></span>
        </header>
        <p class="page-card-line" data-card-line :title="line">{{ line || "—" }}</p>
        <slot />
        <p v-if="fault" class="page-card-fault" role="alert" data-card-fault>{{ fault }}</p>
        <footer class="page-card-foot" data-card-foot>
            <slot name="foot" />
            <span class="page-card-grow" />
            <slot name="actions" />
        </footer>
    </article>
</template>

<style scoped>
.page-card {
    display: flex;
    flex-direction: column;
    gap: var(--s2);
    min-width: 0;
    padding: 14px var(--s4) var(--s3);
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
}

.page-card-head {
    display: flex;
    align-items: center;
    gap: var(--s3);
}

.page-card-mark {
    display: inline-flex;
    flex: none;
    color: var(--text-2);
}

.page-card-names {
    flex: 1;
    min-width: 0;
}

.page-card-title {
    margin: 0;
    overflow: hidden;
    font-size: 13.5px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.page-card-state {
    margin: 2px 0 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.page-card-corner {
    display: inline-flex;
    flex: none;
    align-items: center;
}

.page-card-line {
    margin: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.page-card-fault {
    margin: 0;
    padding: 6px 8px;
    border: 1px solid var(--tone-danger);
    border-radius: 6px;
    color: var(--tone-danger);
    font-size: 12px;
}

.page-card-foot {
    display: flex;
    align-items: center;
    gap: var(--s2);
    min-height: 24px;
    margin-top: auto;
}

.page-card-grow {
    flex: 1;
}
</style>
