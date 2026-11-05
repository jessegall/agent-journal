import {createApp, h} from "vue";
import {expect, test, vi} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import ModuleBody from "../src/windows/ModuleBody.vue";

const drawn = vi.hoisted(() => ({props: null}));
const stub = vi.hoisted(() => ({
    props: ["entry", "subscriptions"],
    setup(props) {
        drawn.props = props;
        return () => null;
    },
}));
vi.mock("../src/windows/PageWindow.vue", () => ({default: stub}));
vi.mock("../src/windows/FrameWindow.vue", () => ({default: stub}));

function mountedBody(declaration) {
    const host = new WindowSubscriptions();
    const app = createApp({render: () => h(ModuleBody, {declaration})});
    app.provide(WINDOW_CONTEXT, {environment: "main", subscriptions: host});
    app.mount(document.createElement("div"));
    return {host, app};
}

test("a shipped body hears the events of the window that draws it, and stops when it goes", () => {
    const {host, app} = mountedBody({type: "questions.question", body_url: "/question-card.js", shipped: true});
    const heard = [];
    drawn.props.subscriptions.follow("questions.question", ["question.*"], (event) => heard.push(event.event));
    expect(host.patterns).toEqual(["question.*"]);
    host.dispatch({event: "question.answer"});
    host.dispatch({event: "task.update"});
    expect(heard).toEqual(["question.answer"]);
    expect(drawn.props.entry.events.length).toBe(1);
    app.unmount();
    host.dispatch({event: "question.close"});
    expect(heard).toEqual(["question.answer"]);
    expect(host.follows).toEqual([]);
});

test("two bodies of one type each keep hearing when the other goes", () => {
    const declaration = {type: "questions.question", body_url: "/question-card.js", shipped: true};
    const host = new WindowSubscriptions();
    const mount = () => {
        const app = createApp({render: () => h(ModuleBody, {declaration})});
        app.provide(WINDOW_CONTEXT, {environment: "main", subscriptions: host});
        app.mount(document.createElement("div"));
        return app;
    };
    const first = mount();
    mount();
    const heard = [];
    drawn.props.subscriptions.follow("questions.question", ["question.*"], (event) => heard.push(event.event));
    first.unmount();
    host.dispatch({event: "question.answer"});
    expect(heard).toEqual(["question.answer"]);
});

test("a body nobody trusts hears only what its declaration names", () => {
    mountedBody({type: "outside.card", body_url: "/card.js", events: ["card.*"]});
    expect(drawn.props.entry.events).toEqual(["card.*"]);
});
