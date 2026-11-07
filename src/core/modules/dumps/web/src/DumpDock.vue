<script setup>
import { computed, unref } from "vue";
import { useDockCard, useWindow } from "@journal/window-kit";
const view = useWindow();
const card = useDockCard();
const foot = view.option("foot");
const count = computed(() => card.data.value?.length ?? 0);
view.follow(["dump_item.*"], card.reload);
</script>
<template>
  <template v-if="unref(foot)"
    ><Teleport :to="unref(foot)"
      ><span
        >Items: <b>{{ count }}</b></span
      ></Teleport
    ></template
  >
</template>
