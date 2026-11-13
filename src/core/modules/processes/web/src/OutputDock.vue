<script setup>
import { computed, nextTick, ref, watch, unref } from "vue";
import {
  Icon,
  MenuItem,
  MenuPanel,
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
const view = useWindow();
const card = useDockCard();
const item = view.option("row");
const head = view.option("head");
const foot = view.option("foot");
const time = view.option("time");
const folded = view.option("folded");
const collapsed = view.option("collapsed");
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
// a card folded to its title line shows only the percent of the run, left of its duration; none while the run has made no progress
const percent = computed(() => {
  if (!unref(collapsed)) return "";
  if (ended.value) return standing.value === "good" ? "100%" : "";
  const done = Math.round(Number(run.value?.progress ?? 0));
  return done > 0 ? `${done}%` : "";
});
const steps = computed(() => {
  if (!run.value?.steps_passed && !run.value?.steps_failed) return "";
  return run.value.steps_failed
    ? `${run.value.steps_passed} passed, ${run.value.steps_failed} failed`
    : `${run.value.steps_passed} passed`;
});
// a run that gives a percent but no step count shows its percent where the steps would go
const progressText = computed(() => {
  if (steps.value || ended.value) return "";
  const done = Math.round(Number(run.value?.progress ?? 0));
  return done > 0 ? `${done}%` : "";
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
    if (terminal.value) pages.feed.drawn(terminal.value);
  });
}

watch(opened, (open) => open && load());

// the agent that ran the run is asked to draw a reader: the journal opens its request and posts one chat message from the user, and the menu item goes
const asked = ref(false);
async function askForReader() {
  const answer = await view.run(["output", "ask-reader", String(item.value?.target_id)]);
  if (answer?.ok !== false) asked.value = true;
}
const canAskForReader = computed(() => !asked.value && !run.value?.reader_requested && !run.value?.reads_progress && !ended.value);
const reportAnchor = ref(null);
const reportOpen = ref(false);
async function reportWith(action) {
  reportOpen.value = false;
  await action();
}
// a user marks the command of the run as one no reader can read, or lifts that mark; the agent is told, and the card reads again
async function markRun(subcommand) {
  const answer = await view.run(["output", subcommand, String(item.value?.target_id)]);
  if (answer?.ok !== false) load();
}
// a run that ends between two reads is read once more, so the card shows its end and not the last percent it drew
watch(ended, (done) => done && load());

view.follow(
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
    <template v-if="unref(foot) && progressText"
      ><Teleport :to="unref(foot)"
        ><span data-output-progress
          >Progress: <b>{{ progressText }}</b></span
        ></Teleport
      ></template
    >
    <template v-if="unref(time)"
      ><Teleport :to="unref(time)"
        ><template v-if="percent">
  <span class="output-dock-percent" data-output-percent role="img" :title="percent" :aria-label="percent"><i :style="{ width: percent, background: TONES.running }" /></span
          >
</template><template v-else>
  <span class="output-dock-figure">{{ ranFor }}</span>
</template></Teleport
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
          <div class="output-dock-box">
            <pre
              ref="terminal"
              class="output-dock-terminal"
              data-output-terminal
              @scroll="pages.loadEarlier($event.target)"
              >{{ lines.length ? lines.join("\n") : "No output yet" }}</pre>
            <template v-if="run?.reading_text"><p class="output-dock-reading" data-output-reading>{{ run.reading_text }}</p></template>
            <template v-if="canAskForReader || run?.markable">
              <button ref="reportAnchor" type="button" class="output-dock-report" data-output-report title="Report a problem with this output" aria-label="Report a problem with this output" :aria-expanded="reportOpen" @click="reportOpen = !reportOpen"><Icon name="dots" :size="14" /></button>
              <template v-if="reportOpen">
                <MenuPanel :anchor="reportAnchor" :min-width="190" data-output-report-menu @close="reportOpen = false">
                  <template v-if="canAskForReader"><MenuItem data-output-reader-ask @click="reportWith(askForReader)">Ask for a better reader</MenuItem></template>
                  <template v-if="run?.markable">
                    <template v-if="run.marked_words"><MenuItem data-output-mark-readable @click="reportWith(() => markRun('readable'))">Mark as readable</MenuItem></template>
                    <template v-else><MenuItem data-output-mark-unreadable @click="reportWith(() => markRun('unreadable'))">Mark as unreadable</MenuItem></template>
                  </template>
                </MenuPanel>
              </template>
            </template>
          </div>
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

/* a folded card's percent as a small bar, centred on the line, with the number in its tooltip */
.output-dock-percent {
  --dock-bar-width: 64px;
  --dock-bar-height: 8px;
  flex: none;
  align-self: center;
  width: var(--dock-bar-width);
  height: var(--dock-bar-height);
  margin-right: 6px;
  overflow: hidden;
  border-radius: 4px;
  background: var(--bar-track);
}

.output-dock-percent i {
  display: block;
  height: 100%;
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
.output-dock-box {
  position: relative;
}
.output-dock-report {
  position: absolute;
  top: 6px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: var(--text-3);
  cursor: pointer;
}
.output-dock-report:hover {
  background: var(--hover);
  color: var(--text);
}
/* the menu shows only while the pointer is over the output's terminal, or while it has the keyboard or is open */
.output-dock-report {
  opacity: 0;
  transition: opacity 0.12s ease;
}
.output-dock-box:hover .output-dock-report,
.output-dock-report:focus-visible,
.output-dock-report[aria-expanded="true"] {
  opacity: 1;
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
