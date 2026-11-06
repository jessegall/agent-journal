<script setup>
import { computed, nextTick, ref, watch, unref } from "vue";
import {
  Icon,
  SkeletonLine,
  afterSkeletonMinimum,
  useNow,
  useDockCard,
  useOutputPages,
  usePoll,
  useWindow,
} from "@journal/window-kit";

const OPENED_MILLISECONDS = 2000;
const CLOSED_MILLISECONDS = 5000;
const TONES = {
  running: "var(--tone-work)",
  good: "var(--tone-good)",
  bad: "var(--danger)",
  stopped: "var(--text-3)",
};
const ICONS = {
  running: "terminal",
  good: "tick",
  bad: "cross",
  stopped: "stop",
};
const STANDINGS = {
  running: "running",
  background: "running",
  finished: "good",
  failed: "bad",
  stopped: "stopped",
  orphaned: "stopped",
};
const window = useWindow();
const card = useDockCard();
const item = window.option("row");
const head = window.option("head");
const foot = window.option("foot");
const time = window.option("time");
const folded = window.option("folded");
const run = card.data;
const pages = useOutputPages(
  card.readOutput,
  () => item.value?.target_id,
);
const lines = pages.lines;
const opened = computed(() => !unref(folded));
const terminal = ref(null);
const outputReady = ref(false);
const FOLLOW_PIXELS = 24;
const now = useNow();

const standing = computed(() => STANDINGS[run.value?.state] ?? "running");
const isRunning = () => standing.value === "running";
const ended = computed(() => standing.value !== "running");
const fraction = computed(() => Number(run.value?.progress ?? 0) / 100);
const width = computed(() =>
  ended.value ? "100%" : `${Math.round(fraction.value * 100)}%`,
);
// when the run began, in seconds, which tells the figure one bar's run from the next
const began = computed(() =>
  run.value?.created_at ? Date.parse(run.value.created_at) / 1000 : 0,
);
const steps = computed(() => {
  if (!run.value?.steps_passed && !run.value?.steps_failed) return "";
  return run.value.steps_failed
    ? `${run.value.steps_passed} passed, ${run.value.steps_failed} failed`
    : `${run.value.steps_passed} passed`;
});
const ranFor = computed(() => {
  if (!run.value?.created_at) return "";
  const until = run.value.ended_at ? Date.parse(run.value.ended_at) : now.value;
  const seconds = Math.max(
    0,
    Math.round((until - Date.parse(run.value.created_at)) / 1000),
  );
  return seconds >= 60
    ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    : `${seconds}s`;
});

async function load() {
  const id = item.value?.target_id;
  if (!id) return;
  await card.reload();
  if (!opened.value) return;
  const box = terminal.value;
  const following =
    !box || box.scrollHeight - box.scrollTop - box.clientHeight < FOLLOW_PIXELS;
  const startedAt = performance.now();
  await pages.follow();
  afterSkeletonMinimum(startedAt, async () => {
    outputReady.value = true;
    await nextTick();
    if (following && terminal.value)
      terminal.value.scrollTop = terminal.value.scrollHeight;
  });
}

watch(opened, (open) => open && load());

window.follow(
  ["process.*"],
  (event) => event.row_id === item.value?.target_id && load(),
);
usePoll(load, isRunning, () =>
  opened.value ? OPENED_MILLISECONDS : CLOSED_MILLISECONDS,
);
</script>

<template>
  <div class="output-dock" data-output-dock>
    <template v-if="head?.value ?? head">
      <Teleport :to="head?.value ?? head">
        <span
          class="output-dock-state"
          :data-state="standing"
          :style="{ '--tone': TONES[standing] }"
        >
          <template v-if="isRunning()"
            ><span class="output-dock-ring"
          /></template>
          <template v-else
            ><Icon :name="ICONS[standing]" :size="14"
          /></template>
        </span>
        <span class="output-dock-title" :title="run?.title || run?.line">{{
          run?.title || run?.line
        }}</span>
        <template v-if="fraction > 0 || ended">
          <div
            class="output-dock-bar"
            :data-figure-bar="ended ? standing : ''"
            :data-figure-began="began"
          >
            <div
              class="output-dock-fill"
              :style="{ width, background: TONES[standing] }"
              :data-figure-progress="ended ? null : ''"
            />
          </div>
        </template>
      </Teleport>
    </template>
    <template v-if="unref(foot) && isRunning() && !fraction && !steps"
      ><Teleport :to="unref(foot)"
        ><span class="output-dock-pending" data-output-pending aria-label="Pending"
          ><i /><i /><i /></span
      ></Teleport>
    </template>
    <template v-if="unref(foot) && steps"
      ><Teleport :to="unref(foot)"
        ><span data-output-steps
          >Steps: <b>{{ steps }}</b></span
        ></Teleport
      ></template
    >
    <template v-if="unref(time)"
      ><Teleport :to="unref(time)"
        ><span class="output-dock-figure">{{ ranFor }}</span></Teleport
      ></template
    >
    <div class="output-dock-more">
      <div class="output-dock-inner">
        <template v-if="!outputReady"
          ><SkeletonLine
            class="output-dock-loading"
            :bars="[
              { width: '70%', height: 11 },
              { width: '45%', height: 11 },
            ]"
        /></template>
        <template v-else>
          <pre
            ref="terminal"
            class="output-dock-terminal"
            data-output-terminal
            @scroll="pages.loadEarlier($event.target)"
            >{{ lines.join("\n") }}</pre>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.output-dock-inner {
  min-height: 0;
  overflow: hidden;
}

.output-dock-state {
  display: flex;
  flex: none;
  justify-content: center;
  width: 14px;
  color: var(--tone);
}

.output-dock-ring {
  width: 10px;
  height: 10px;
  border: 1.5px solid color-mix(in srgb, var(--tone) 30%, transparent);
  border-top-color: var(--tone);
  border-radius: 50%;
  animation: output-spin 0.9s linear infinite;
}
@keyframes output-spin {
  to {
    transform: rotate(360deg);
  }
}
.output-dock-pending {
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: 3px;
}
.output-dock-pending i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-3);
  animation: output-pending 1.2s ease-in-out infinite;
}
.output-dock-pending i:nth-child(2) {
  animation-delay: 0.2s;
}
.output-dock-pending i:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes output-pending {
  0%,
  60%,
  100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .output-dock-pending i {
    animation: none;
  }
}
.output-dock-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.output-dock-figure {
  flex: none;
  color: var(--text-3);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}

.output-dock-terminal {
  overflow: auto;
  /* the chat's foot takes at most 40% of the chat: the card fits it, its head and margins left out */
  max-height: min(280px, calc(40cqh - 72px));
  margin: 0;
  padding: 8px 14px 8px 36px;
  background: var(--term);
  color: var(--text-2);
  font-family: var(--mono, monospace);
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.output-dock-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: 1px;
  background: var(--border);
  overflow: hidden;
}

.output-dock-fill {
  height: 100%;
  transition: width 0.4s ease;
}
.output-dock-loading {
  padding: 8px 14px 8px 36px;
  height: 60px;
  background: var(--term);
}
.output-dock-terminal {
  animation: output-fade 220ms var(--ease) 320ms backwards;
}
@keyframes output-fade {
  from {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .output-dock-terminal {
    animation-duration: 100ms;
    animation-delay: 0ms;
  }
}
</style>
