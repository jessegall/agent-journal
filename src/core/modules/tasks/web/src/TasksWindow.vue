<script setup>
import {ref} from "vue";
import {Btn, useWindow} from "@journal/window-kit";
import TaskGroups from "./TaskGroups.vue";
import TasksDialog from "./TasksDialog.vue";

// the tasks window: its groups of tasks, and the dialog for managing them
const context = useWindow();
const managing = ref(false);
</script>

<template>
    <TaskGroups>
        <template v-if="!context.shared" #tools>
            <Btn small bordered data-manage-tasks @click="managing = true">Manage tasks</Btn>
        </template>
    </TaskGroups>
    <template v-if="managing">
        <TasksDialog @close="managing = false" />
    </template>
</template>
