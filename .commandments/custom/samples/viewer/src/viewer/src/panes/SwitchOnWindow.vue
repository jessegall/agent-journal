<script setup>
import SwitchCase from "../kit/SwitchCase.vue";
</script>

<template>
    <!-- @sin architecture_viewer_switch_case_in_window_code -->
    <SwitchCase :value="name">
        <template #chat><p>chat</p></template>
    </SwitchCase>
    <!-- @righteous architecture_viewer_switch_case_in_window_code -->
    <p>plain</p>
</template>
