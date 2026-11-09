<script setup>
import {Icon, PinsToggle, usePins, useWindow} from "@journal/window-kit";

// the pins above the chat history: each opens its link or, when the link is a ! command, types it into the main agent's terminal through the journal
const view = useWindow();
const {rows: pins, act: runOnPin} = view.props.pins;
const {visible: pinned} = usePins(() => pins.value);
const linkOf = (pin) => (pin.link.startsWith("http") ? pin.link : `#open=${pin.link}`);
const isCommand = (pin) => pin.link.startsWith("!");
async function runCommand(pin) {
    const main = await view.readKey("main-agent");
    if (main.ok && main.value.id) await runOnPin(["agent", "type", String(main.value.id), pin.link]);
}
</script>

<template>
    <div data-pins class="pins">
        <template v-for="pin in pinned" :key="pin.id">
            <div class="pin">
                <span class="pin-dot" />
                <span class="pin-text">{{ pin.title }}</span>
                <template v-if="isCommand(pin)">
                    <button type="button" class="pin-link" data-pin-run :title="pin.link" @click="runCommand(pin)">{{ pin.label }}</button>
                </template>
                <template v-else>
                    <a class="pin-link" :href="linkOf(pin)" :target="pin.link.startsWith('http') ? '_blank' : undefined">{{ pin.label }}</a>
                </template>
                <button type="button" class="pin-close" data-pin-close aria-label="Close" @click="runOnPin(['pin', 'close', String(pin.id)])">
                    <Icon name="close" :size="12" />
                </button>
            </div>
        </template>
        <PinsToggle :pin-rows="pins" />
    </div>
</template>

<style scoped>
.pins {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    /* version 4's pins run edge to edge under the tab bar: out past the pane's padding on the sides, and with no gap to the history below */
    margin: 0 -12px -8px;
}

.pin {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 10px;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--accent) 10%, var(--bg));
    font-size: 13px;
}

.pin-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.pin-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pin-link {
    flex: none;
    padding: 2px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text);
    font-size: 12px;
}

.pin-close {
    flex: none;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}
</style>
