<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import StateDot from "../kit/StateDot.vue";

const props = defineProps({
    board: {type: Object, required: true},
    running: {type: Number, default: 0},
    waiting: {type: Number, default: 0},
    busy: Boolean,
});
const emit = defineEmits(["play", "pause", "resume"]);
const run = computed(() => Boolean(props.board.data.started));
const paused = computed(() => Boolean(props.board.data.paused));
const finished = computed(() => Boolean(props.board.data.finished));
const mode = computed(() => {
    if (!run.value) return "play";
    if (finished.value) return "finished";
    return paused.value ? "paused" : "run";
});
const added = computed(() => (props.board.data.added || {}).tickets || []);
const counted = (n, one, many) => `${n} ${n === 1 ? one : many}`;
</script>

<template>
    <Transition name="play-strip" mode="out-in">
        <template v-if="mode === 'finished'">
            <section key="finished" class="play-strip done">
                <StateDot state="done" />
                <p class="play-strip-line">
                    <b>The board is finished.</b>
                    <span>The main agent is checking the goal against what was built.</span>
                </p>
            </section>
        </template>
        <template v-else-if="mode === 'paused'">
            <section key="paused" class="play-strip">
                <StateDot />
                <p class="play-strip-line">
                    <b>Paused.</b>
                    <span>Running agents finish their step; no new ticket starts until you resume.</span>
                </p>
                <span class="play-strip-meta">{{ counted(running, "agent", "agents") }} running · {{ waiting }} waiting</span>
                <Btn kind="primary" small :busy="busy" @click="emit('resume')">
                    <Icon name="start" />
                    Resume
                </Btn>
            </section>
        </template>
        <template v-else-if="mode === 'run'">
            <section key="run" class="play-strip run">
                <StateDot :state="running ? 'running' : ''" />
                <p class="play-strip-line">
                    <b>Run by the main agent</b>
                    <span>
                        ·
                        {{
                            running
                                ? "it reviews each plan and each change, then merges; it stays free for your requests"
                                : "new tickets start as they arrive"
                        }}
                    </span>
                </p>
                <span class="play-strip-meta">{{ counted(running, "agent", "agents") }} running · {{ waiting }} waiting</span>
                <Btn small :busy="busy" title="No new ticket starts; running agents finish their step" @click="emit('pause')">
                    <Icon name="pause" />
                    Pause
                </Btn>
            </section>
        </template>
        <template v-else-if="added.length || waiting">
            <section key="play" class="play-strip">
                <p class="play-strip-line">
                    <template v-if="added.length">
                        <b>{{ counted(added.length, "ticket", "tickets") }} added.</b>
                    </template>
                    <span>
                        Play hands this board to the main agent: one agent per ticket, each in its own worktree, in board order. It reviews
                        every plan and every change, then merges. You can keep talking to it meanwhile.
                    </span>
                </p>
                <Btn kind="primary" small :busy="busy" @click="emit('play')">
                    <Icon name="start" />
                    Play
                </Btn>
            </section>
        </template>
    </Transition>
</template>

<style scoped>
.play-strip {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    margin: 0 0 14px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 11px;
    background: var(--raised);
}

.play-strip.run {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border-2));
    background: color-mix(in srgb, var(--accent) 7%, var(--raised));
}

.play-strip.done {
    border-color: color-mix(in srgb, var(--tone-good) 35%, var(--border-2));
    background: color-mix(in srgb, var(--tone-good) 5%, var(--raised));
}

.play-strip-line {
    flex: 1;
    min-width: 0;
    margin: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 13px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.play-strip-line b {
    margin-right: 4px;
    color: var(--text);
    font-weight: 500;
}

.play-strip-meta {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.play-strip-enter-active {
    transition:
        opacity 0.18s ease-out 0.06s,
        transform 0.18s var(--ease) 0.06s;
}

.play-strip-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.play-strip-enter-from {
    opacity: 0;
    transform: translateY(3px);
}

.play-strip-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

@media (max-width: 760px) {
    .play-strip {
        flex-wrap: wrap;
    }

    .play-strip-line {
        flex-basis: 100%;
        white-space: normal;
    }
}

@media (prefers-reduced-motion: reduce) {
    .play-strip-enter-active,
    .play-strip-leave-active {
        transition: none;
    }
}
</style>
