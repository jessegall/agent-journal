<script setup>
import {computed, onUnmounted, ref} from "vue";
import {tick} from "../haptic.js";
import {usePress} from "./press.js";
import {ACTION_WIDTH, ARMED_AT, EDGE, LEAD_MOST, OPEN_AT, OVERSHOOT, START, closeOpened, opened} from "./swipes.js";

const props = defineProps({
    label: {type: String, required: true},
    lead: {type: Object, default: null},
    trail: {type: Array, default: () => []},
});
const emit = defineEmits(["open", "hold"]);
const x = ref(0);
const dragging = ref(false);
const shown = ref(false);
const trailWidth = computed(() => props.trail.length * ACTION_WIDTH);
const armed = computed(() => Boolean(props.lead) && x.value > ARMED_AT);
const swipes = computed(() => Boolean(props.lead) || props.trail.length > 0);
const press = usePress(() => emit("hold"));
const self = {shut};
let drag = null;

function shut() {
    x.value = 0;
    shown.value = false;
    if (opened.value === self) opened.value = null;
}

function down(event) {
    if (event.button > 0 || event.target.closest(".row-more")) return;
    press.down(event);
    drag = {
        x: event.clientX,
        y: event.clientY,
        from: shown.value ? -trailWidth.value : 0,
        moving: false,
        edge: event.clientX < EDGE,
        id: event.pointerId,
    };
}

function moved(event) {
    if (!drag) return;
    press.moved(event);
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moving) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < START) return;
        if (!swipes.value || drag.edge || Math.abs(dy) >= Math.abs(dx)) {
            drag = null;
            return;
        }
        drag.moving = true;
        dragging.value = true;
        press.lift();
        closeOpened(self);
        event.currentTarget.setPointerCapture(drag.id);
    }
    const was = armed.value;
    x.value = Math.max(-trailWidth.value - OVERSHOOT, Math.min(props.lead ? LEAD_MOST : 0, drag.from + dx));
    if (armed.value && !was) tick();
}

function up() {
    press.lift();
    const done = drag;
    drag = null;
    dragging.value = false;
    if (!done?.moving) return;
    if (armed.value) {
        x.value = window.innerWidth;
        setTimeout(() => (props.lead.run(), shut()), 180);
        return;
    }
    if (x.value < -OPEN_AT && trailWidth.value) {
        x.value = -trailWidth.value;
        shown.value = true;
        opened.value = self;
        return;
    }
    shut();
}

function cancelled() {
    press.lift();
    drag = null;
    dragging.value = false;
    if (!shown.value) x.value = 0;
}

function tapped() {
    if (press.took() || x.value > 0) return;
    if (shown.value) return shut();
    if (opened.value) return closeOpened();
    emit("open");
}

function act(action) {
    shut();
    action.run();
}

onUnmounted(() => opened.value === self && (opened.value = null));
</script>

<template>
    <div :class="['swipe', {right: x > 0, armed}]">
        <template v-if="lead">
            <div class="swipe-lead" aria-hidden="true">
                <b>{{ armed ? "Let go" : lead.label }}</b>
            </div>
        </template>
        <template v-if="trail.length">
            <div class="swipe-trail" :style="{width: `${trailWidth}px`}">
                <template v-for="action in trail" :key="action.key">
                    <button type="button" :class="['swipe-act', action.tone]" :tabindex="shown ? 0 : -1" @click="act(action)">
                        {{ action.label }}
                    </button>
                </template>
            </div>
        </template>
        <div
            :class="['swipe-front', {dragging}]"
            role="button"
            tabindex="0"
            :aria-label="label"
            :style="{transform: x ? `translateX(${x}px)` : undefined}"
            @pointerdown="down"
            @pointermove="moved"
            @pointerup="up"
            @pointercancel="cancelled"
            @pointerleave="press.lift"
            @contextmenu.prevent
            @click="tapped"
            @keydown.enter.prevent="emit('open')"
            @keydown.space.prevent="emit('open')"
        >
            <slot />
        </div>
    </div>
</template>

<style scoped>
.swipe {
    position: relative;
    overflow: hidden;
}

.swipe:not(.right) .swipe-lead,
.swipe.right .swipe-trail {
    visibility: hidden;
}

.swipe-lead,
.swipe-trail {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
}

.swipe-lead {
    left: 0;
    right: 0;
    align-items: center;
    padding-left: 22px;
    background: var(--tone-good);
    color: #0b1a10;
    font-weight: 600;
}

.swipe.armed .swipe-lead {
    background: #86d49f;
}

.swipe-trail {
    right: 0;
}

.swipe-act {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
    border: 0;
    background: #45474e;
    color: #fff;
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
}

.swipe-act.block {
    background: #d9a441;
    color: #1a1204;
}

.swipe-act.start {
    background: #3f63ad;
}

.swipe-front {
    position: relative;
    z-index: 1;
    background: var(--raised);
    touch-action: pan-y;
    transition:
        transform 260ms var(--push),
        background-color 150ms linear;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
}

.swipe-front.dragging {
    transition: none;
}

.swipe-front.pressing {
    background: var(--hover);
}
</style>
