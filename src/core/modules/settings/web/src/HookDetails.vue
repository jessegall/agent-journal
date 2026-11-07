<script setup>
defineProps({ hook: { type: Object, required: true } });
const EFFECT_LABELS = {
  can_refuse: "Can refuse",
  can_rewrite: "Can rewrite",
  adds_lines: "Adds context",
  overlaps: "Also checked by journal",
};
</script>

<template>
  <div class="hook-details">
    <div class="hook-identity">
      <strong>{{ hook.program }}</strong
      ><span>{{ hook.event }}</span
      ><code>{{ hook.matcher || "All" }}</code>
    </div>
    <details class="hook-command">
      <summary :title="hook.command">
        <code>{{ hook.command }}</code>
      </summary>
      <pre>{{ hook.command }}</pre>
    </details>
    <div class="hook-source">
      <code>{{ hook.source }}</code
      ><template v-if="hook.tracked"><span>Tracked by Git</span></template>
    </div>
    <div class="hook-effects">
      <template v-for="effect in hook.effects" :key="effect"
        ><span>{{ EFFECT_LABELS[effect] || effect }}</span></template
      >
    </div>
  </div>
</template>

<style scoped>
.hook-details {
  flex: 1;
  min-width: 0;
}
.hook-identity,
.hook-source,
.hook-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.hook-identity {
  font-size: 12px;
}
.hook-command {
  margin: 5px 0;
}
.hook-command summary {
  cursor: pointer;
  min-width: 0;
}
.hook-command summary code {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.hook-command pre {
  margin: 8px 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 12px;
}
.hook-source {
  color: var(--text-3);
  font-size: 11px;
  overflow-wrap: anywhere;
}
.hook-effects {
  margin-top: 5px;
}
.hook-effects span {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--raised);
  color: var(--text-2);
  font-size: 10px;
}
</style>
