<script setup>
import {FigureFloors, VoiceFigure, WindowRoom, holdAvatarWindow, useChatFigure, useWindow} from "@journal/window-kit";

// the avatar in a window of its own: while this window is on the page the figure lives and moves here, and the chat draws none; without it the figure
// stays in the chat as before
const view = useWindow();
holdAvatarWindow();
const {figureVoice, figureHere, shownVoice, runningTool, waitingFor, thinking, asking, heardAt} = useChatFigure(view, {chosen: () => "voice"});
</script>

<template>
    <WindowRoom padding="0">
        <div class="avatar" data-figure-world data-avatar>
            <FigureFloors />
            <template v-if="!figureVoice"><p class="note" data-avatar-off>The avatar is off. Turn it on in the voice settings.</p></template>
            <div class="stage" data-figure-home>
                <VoiceFigure :voice="shownVoice" :here="figureHere" :running="runningTool" :heard-at="heardAt" :thinking="thinking" :waiting-for="waitingFor" :asking="asking" :marks="[]" :messages="[]" :faces="[]" @gone="shownVoice = ''" />
            </div>
        </div>
    </WindowRoom>
</template>

<style scoped>
.avatar {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-sizing: border-box;
    height: 100%;
    min-height: 160px;
    container-type: size;
}

.note {
    margin: 0;
    padding: 12px;
    color: var(--text-3);
    font-size: 12.5px;
}

.stage {
    position: relative;
    height: 96px;
}
</style>
