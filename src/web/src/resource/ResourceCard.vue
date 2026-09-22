<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import Icon from "../kit/Icon.vue";
import {age} from "../format/time.js";
import {meta} from "../state/store.js";
import {computed} from "vue";

const props = defineProps({resource: Object});
const holds = computed(() => {
    if (props.resource.type !== "collection") return [];
    const counted = {};
    for (const ref of props.resource.refs) {
        const type = ref.split(":")[0];
        if (meta(type).title) counted[type] = (counted[type] || 0) + 1;
    }
    return Object.entries(counted).map(([type, n]) => ({type, n, icon: meta(type).icon, title: meta(type).title}));
});
</script>

<template>
    <button type="button" :class="['card', {completed: resource.completed}]">
        <span class="head">
            <Icon :name="meta(resource.type).icon" :size="14" />
            <span class="n">{{ meta(resource.type).title }} {{ resource.n }}</span>
            <template v-if="resource.data.system">
                <span class="badge" title="Ships with the journal; it cannot be removed">System</span>
            </template>
            <span class="age">{{ age(resource.updated || resource.created) }}</span>
        </span>
        <span class="title">{{ resource.title }}</span>
        <TextDisplay inline class="abstract" :text="resource.abstract || resource.brief" />
        <template v-if="holds.length">
            <span class="holds">
                <template v-for="h in holds" :key="h.type">
                    <span class="holds-kind" :title="`${h.n} ${h.title.toLowerCase()}${h.n > 1 ? 's' : ''}`">
                        <Icon :name="h.icon" :size="12" />
                        {{ h.n }}
                    </span>
                </template>
            </span>
        </template>
        <template v-if="resource.sections.length">
            <span class="parts">
                {{ resource.sections.length }} {{ resource.type === "sequence" ? "step" : "part"
                }}{{ resource.sections.length > 1 ? "s" : "" }}
                <template v-if="resource.type === 'sequence'">
                    ·
                    {{
                        resource.data.starts_on
                            ? `starts when a ${resource.data.starts_on.replace(".completed", " is finished").replace(".created", " is created")}`
                            : "run by hand"
                    }}
                </template>
            </span>
        </template>
    </button>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 130px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    text-align: left;
    cursor: pointer;
}
.holds {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
    color: var(--text-3);
    font-size: 11.5px;
}

.holds-kind {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.badge {
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    color: var(--text-2);
    font-size: 10.5px;
    letter-spacing: 0.04em;
}

.card:hover {
    border-color: var(--border-2);
    background: var(--hover);
}
.card.completed {
    opacity: 0.6;
}
.head {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
    font-size: 12px;
}
.n {
    color: var(--text-3);
}
.age {
    margin-left: auto;
    color: var(--text-3);
}
.title {
    font-weight: 500;
}
.abstract {
    color: var(--text-3);
    font-size: 12.5px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.parts {
    margin-top: auto;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
