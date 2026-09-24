<script setup>
import Icon from "../kit/Icon.vue";

defineProps({status: {type: Object, required: true}});
</script>

<template>
    <div class="tunnel-problem">
        <Icon name="warn" :size="14" />
        <template v-if="!status.installed">
            <p>
                Sharing needs
                <b>tunler</b>
                , and it isn't installed on this machine. Install it, then log in with
                <code>tunler login you@example.com</code>
                .
            </p>
        </template>
        <template v-else>
            <p>
                <b>tunler</b>
                isn't logged in on this machine. Run
                <code>tunler login you@example.com</code>
                in a terminal, then try again.
            </p>
        </template>
    </div>
</template>

<style scoped>
.tunnel-problem {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--tone-warn) 45%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--tone-warn) 10%, transparent);
    color: var(--tone-warn);
}

.tunnel-problem .ico {
    flex: none;
    margin-top: 2px;
}

p {
    margin: 0;
    color: var(--text);
    font-size: 12.5px;
    line-height: 1.5;
}

code {
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--raised);
    font-size: 11.5px;
}
</style>
