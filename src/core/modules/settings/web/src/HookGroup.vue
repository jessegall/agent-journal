<script setup>
defineProps({
  title: { type: String, required: true },
  count: { type: Number, required: true },
  empty: { type: String, required: true },
});
</script>

<template>
  <section class="hook-group">
    <h2>
      {{ title }} <span>{{ count }}</span>
    </h2>
    <template v-if="count"><slot /></template>
    <template v-else
      ><p>{{ empty }}</p></template
    >
  </section>
</template>

<style scoped>
.hook-group h2 {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
}
.hook-group h2 span {
  color: var(--text-3);
  font-size: 11px;
  font-weight: 400;
}
.hook-group p {
  margin: 8px 0;
  color: var(--text-3);
  font-size: 12px;
}
</style>
