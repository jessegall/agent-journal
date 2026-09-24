<script setup>
defineProps({links: {type: Array, required: true}});
const emit = defineEmits(["toggle"]);
const HINTS = {
    kept: "Click to drop this wait",
    dropped: "Click to keep this wait",
    unpicked: "Pick that card too, or it will not wait on it",
};
</script>

<template>
    <ul class="links">
        <template v-for="link in links" :key="link.n">
            <li>
                <button type="button" :class="['link', link.state]" :title="HINTS[link.state]" @click.stop="emit('toggle', link.n)">
                    Needs {{ link.title }} first
                    <template v-if="link.where">
                        <span class="where">· {{ link.where }}</span>
                    </template>
                    <template v-if="link.state === 'unpicked'">
                        <span class="where">· not picked</span>
                    </template>
                </button>
            </li>
        </template>
    </ul>
</template>

<style scoped>
.links {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    line-height: 17px;
    text-align: left;
    cursor: pointer;
    transition: color 0.2s;
}

.link:hover {
    color: var(--text-2);
}

.link.dropped {
    text-decoration: line-through;
    opacity: 0.6;
}

.link.unpicked {
    color: var(--warn, #e0b060);
}

.where {
    color: var(--text-3);
}
</style>
