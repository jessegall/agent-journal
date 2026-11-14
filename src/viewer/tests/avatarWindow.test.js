import {createApp, h, ref} from "vue";
import {afterEach, expect, test} from "vitest";
import {avatarWindowOpen, holdAvatarWindow} from "../src/figure/avatarWindow.js";
import {useChatFigure} from "../src/composables/chatFigure.js";

const mounted = [];
afterEach(() => mounted.splice(0).forEach((app) => app.unmount()));

const mount = (setup) => {
    const app = createApp({setup, render: () => h("div")});
    app.mount(document.createElement("div"));
    mounted.push(app);
    return app;
};
const setting = (value) => ({data: ref({value}), loaded: ref(true)});
const view = () => ({
    props: {"voice-profile": setting("butler"), "voice-avatar": setting(true), "voice-avatar-shown": setting("always"), tool: {data: ref({}), failure: ref("")}},
    follow: () => {},
    reload: () => {},
});
const figure = (held) => {
    let state;
    mount(() => {
        state = useChatFigure(view(), {chosen: () => "voice", held});
        return () => h("div");
    });
    return state;
};

test("test_avatar_window_added_and_removed: the chat lets the figure go while an avatar window is on the page and takes it back when the window is gone", () => {
    expect(avatarWindowOpen.value).toBe(false);
    const window = mount(() => holdAvatarWindow());
    expect(avatarWindowOpen.value).toBe(true);
    const other = mount(() => holdAvatarWindow());
    window.unmount();
    mounted.splice(mounted.indexOf(window), 1);
    expect(avatarWindowOpen.value).toBe(true);
    other.unmount();
    mounted.splice(mounted.indexOf(other), 1);
    expect(avatarWindowOpen.value).toBe(false);
});

test("test_avatar_lives_in_the_window: the figure is on the page of the chat only when no avatar window holds it, and the window always draws the figure", () => {
    expect(figure(() => false).figureHere.value).toBe(true);
    const kept = figure(() => true);
    expect(kept.figureHere.value).toBe(false);
    expect(kept.figureVoice.value).toBe("butler");
    expect(kept.shownVoice.value).toBe("butler");
});

test("an avatar that is switched off in the voice settings is on no page", () => {
    const state = (() => {
        let found;
        mount(() => {
            const off = view();
            off.props["voice-avatar-shown"] = setting("never");
            found = useChatFigure(off, {chosen: () => "voice"});
            return () => h("div");
        });
        return found;
    })();
    expect(state.figureHere.value).toBe(false);
});
