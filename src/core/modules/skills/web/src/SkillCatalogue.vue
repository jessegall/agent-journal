<script setup>
defineProps({rows: {type: Array, required: true}});
const emit = defineEmits(["open", "back"]);
</script>

<template>
    <div class="skills">
        <button type="button" class="skills-back" @click="emit('back')">Back</button>
        <ul class="skills-catalogue">
            <template v-for="skill in rows" :key="skill.folder">
                <li>
                    <button type="button" class="skill-entry" @click="emit('open', skill.folder)">
                        <span class="skill-name">{{ skill.folder }}</span>
                        <span class="skill-description">{{ skill.description }}</span>
                    </button>
                </li>
            </template>
        </ul>
    </div>
</template>

<style scoped>
.skills-catalogue {
    margin: 0;
    padding: 0;
    list-style: none;
}

.skill-entry {
    display: flex;
    gap: 8px;
    align-items: baseline;
    width: 100%;
    text-align: left;
}

.skill-description {
    color: var(--text-3);
    font-size: 12px;
}
</style>
