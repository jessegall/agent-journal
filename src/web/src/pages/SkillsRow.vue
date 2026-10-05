<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import ListRow from "../kit/ListRow.vue";
import StateDot from "../kit/StateDot.vue";
import Switch from "../kit/Switch.vue";

const props = defineProps({skill: {type: Object, required: true}, depth: {type: Number, default: 0}});
defineEmits(["open", "always"]);

const state = computed(() => (props.skill.stale ? "Changed since loaded" : props.skill.loaded ? "Loaded" : "Not loaded"));
</script>

<template>
    <div class="skill-row" :style="{'--depth': props.depth}">
        <Btn kind="text" fill class="skill-open" :aria-label="`Open ${skill.name}`" @click="$emit('open', skill)">
            <ListRow :title="skill.name" :text="skill.description">
                <template #end>
                    <span :class="['skill-state', {stale: skill.stale}]">
                        <StateDot :state="skill.loaded && !skill.stale ? 'done' : ''" />
                        {{ state }}
                    </span>
                </template>
            </ListRow>
        </Btn>
        <Switch
            class="skill-switch"
            :on="skill.always"
            word="Session start"
            :title="skill.always ? 'Stop loading it at session start' : 'Load it at session start'"
            @change="$emit('always', skill, $event)"
        />
    </div>
</template>

<style scoped>
.skill-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 12px;
    margin-left: calc(var(--depth) * 18px);
    border-bottom: 1px solid var(--line);
}

.skill-open {
    flex: 1;
    min-width: 0;
    color: inherit;
}

.skill-state {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.skill-state.stale {
    color: var(--tone-warn, var(--text-2));
}

.skill-switch {
    flex: none;
}
</style>
