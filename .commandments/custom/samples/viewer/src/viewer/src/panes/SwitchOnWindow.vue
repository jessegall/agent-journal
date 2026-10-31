<script setup>
import SwitchCase from "../kit/SwitchCase.vue";
</script>

<template>
    <!-- @sin architecture_viewer_SwitchCaseOnWindowDetector -->
    <SwitchCase :value="name">
        <template #chat><p>chat</p></template>
    </SwitchCase>
    <!-- @righteous architecture_viewer_SwitchCaseOnWindowDetector -->
    <p>plain</p>
</template>
