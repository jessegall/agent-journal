import {computed, ref, watch} from "vue";
import {READ_RATES} from "./readRates.js";
import {coalesced} from "./coalesced.js";

const COMMAND_LINGER_MS = 5000;

// the state the figure of the chat is drawn from: which voice it is, whether it is on the page, and the tool the agent has in hand. The chat draws it, and so
// does the avatar window, which takes the figure away from the chat while it is on the page. chosen says which figure the window names; held says that
// another window carries the figure now, so this one lets it go
export function useChatFigure(view, {chosen, held = () => false}) {
    const settingOf = (key) => view.props[key].data.value?.value;
    const runningTool = ref("");
    const waitingFor = ref("");
    const thinking = ref(false);
    const asking = ref(false);
    const heardAt = ref(Date.now() / 1000);
    // the figure is the one the window names, or by default the voice the user chose, shown as the figure settings say: always, only while the agent works, or never
    const voice = computed(() => (view.props["voice-profile"].loaded.value ? {profile: settingOf("voice-profile"), avatar: settingOf("voice-avatar"), avatar_shown: settingOf("voice-avatar-shown")} : null));
    const voiceFigure = () => {
        if (!voice.value?.avatar || voice.value.avatar_shown === "never") return "";
        return voice.value.avatar_shown === "working" && !runningTool.value ? "" : voice.value.profile;
    };
    const figureVoice = computed(() => {
        const named = chosen();
        if (named === "voice") return voiceFigure();
        return named && named !== "none" ? named : "";
    });
    // the figure stays on the page until its exit has played once it should go, and is put on the page only when it should be there
    const figureHere = computed(() => Boolean(figureVoice.value) && !held());
    const shownVoice = ref("");
    watch(figureVoice, (voiceNow) => {
        if (voiceNow) shownVoice.value = voiceNow;
    }, {immediate: true});
    const toolRunning = ref(false);
    const commandShown = ref(false);
    let fadeTimer = 0;
    // a finished command stays on the strip for five seconds and then gives way to the thinking word; a running one stays as long as it runs
    const {data: toolProp, failure: toolFailure} = view.props.tool;
    watch([toolProp, toolFailure], () => {
        const tool = toolFailure.value ? {} : (toolProp.value ?? {});
        const changed = (tool.tool ?? "") !== runningTool.value || Boolean(tool.running) !== toolRunning.value;
        if (changed) {
            clearTimeout(fadeTimer);
            commandShown.value = Boolean(tool.tool);
            if (tool.tool && !tool.running) fadeTimer = setTimeout(() => { commandShown.value = false; }, COMMAND_LINGER_MS);
        }
        toolRunning.value = Boolean(tool.running);
        runningTool.value = tool.tool ?? "";
        waitingFor.value = tool.wait_target ?? "";
        thinking.value = Boolean(tool.thinking);
        asking.value = Boolean(tool.asking);
    });
    heardAt.value = Date.now() / 1000;
    view.follow(["hook_call.*", "dock_item.*", "process_part.*"], coalesced(() => {
        heardAt.value = Date.now() / 1000;
        view.reload("tool");
    }, READ_RATES.runningTool));
    return {figureVoice, figureHere, shownVoice, runningTool, waitingFor, thinking, asking, heardAt, toolRunning, commandShown};
}
