<script setup>
import { unref } from "vue";
import { stateLabel, useDockCard, useWindow } from "@journal/window-kit";
const row = useDockCard().data;
const foot = useWindow().option("foot");
</script>
<template>
  <template v-if="unref(foot) && row"
    ><Teleport :to="unref(foot)"
      ><span
        >Task: <b>{{ stateLabel("task", row.state).toLowerCase() }}</b></span
      ></Teleport
    ></template
  >
</template>
