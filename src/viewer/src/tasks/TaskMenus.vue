<script setup>
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {moreActs, statusChoices} from "../domain/taskBoard.js";
import TaskAsk from "./TaskAsk.vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";
import {NORMAL_PRIORITY, PRIORITY_LEVELS} from "../domain/taskPriority.js";

const props = defineProps({menu: {type: Object, default: null}, tasks: {type: Array, required: true}, acts: {type: Object, required: true}});
const emit = defineEmits(["close", "show", "run"]);

function setPriority(value) {
    const task = props.menu.task;
    emit("close");
    props.acts.priority(task, value);
}

function pick(name) {
    const task = props.menu.task;
    emit("close");
    emit("run", task, name);
}
</script>

<template>
    <template v-if="menu">
        <MenuPanel :anchor="menu.el" :min-width="220" :max-width="300" @close="emit('close')">
            <template v-if="menu.kind === 'status'">
                <MenuLabel>Change the status of task {{ menu.task.id }}</MenuLabel>
                <template v-for="c in statusChoices(menu.task)" :key="c.status">
                    <MenuItem
                        :on="c.current"
                        :disabled="!c.act && !c.current"
                        :title="c.act || c.current ? '' : c.note"
                        @click="c.act && pick(c.act)"
                    >
                        <TaskStatusIcon :status="c.status" />
                        {{ c.label }}
                    </MenuItem>
                </template>
            </template>
            <template v-else-if="menu.kind === 'priority'">
                <MenuLabel>Priority of task {{ menu.task.id }}</MenuLabel>
                <template v-for="level in [...PRIORITY_LEVELS].reverse()" :key="level.key">
                    <MenuItem :on="level.key === (menu.task.priority ?? NORMAL_PRIORITY)" @click="setPriority(level.key)">{{ level.label }}</MenuItem>
                </template>
            </template>
            <template v-else>
                <MenuLabel>Task {{ menu.task.id }}</MenuLabel>
                <MenuItem @click="emit('show', 'status', menu.task, menu.el)">Change status</MenuItem>
                <template v-for="a in moreActs(menu.task)" :key="a.name">
                    <MenuItem @click="pick(a.name)">{{ a.label }}</MenuItem>
                </template>
                <MenuItem danger @click="pick('delete')">Delete task {{ menu.task.id }}</MenuItem>
            </template>
        </MenuPanel>
    </template>
    <template v-if="acts.asking.value">
        <TaskAsk :asking="acts.asking.value" :tasks="tasks" :acts="acts" @close="acts.asking.value = null" />
    </template>
</template>
