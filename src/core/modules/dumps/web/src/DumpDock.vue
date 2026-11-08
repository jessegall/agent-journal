<script setup>
import { computed, unref } from "vue";
import { eventAboutRows, eventChildOf, useDockCard, useWindow } from "@journal/window-kit";
const view = useWindow();
const card = useDockCard();
const foot = view.option("foot");
const count = computed(() => card.data.value?.length ?? 0);
const item = view.option("row");
view.follow(["dump_item.*"], (event) => {
  const items = new Set((card.data.value ?? []).map((row) => row.id));
  if (eventAboutRows(event, items) || eventChildOf(event, "dump_id", new Set([unref(item).target_id]))) card.reload();
});
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
