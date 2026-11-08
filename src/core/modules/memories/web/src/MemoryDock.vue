<script setup>
import { unref } from "vue";
import { useDockCard, useWindow } from "@journal/window-kit";
const row = useDockCard().data;
const foot = useWindow().option("foot");
</script>
<template>
  <template v-if="unref(foot) && row"
    ><Teleport :to="unref(foot)"
      ><span
        >Weight: <b>{{ row.weight }}</b></span
      ></Teleport
    ></template
  >
</template>
