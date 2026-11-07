import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import FigureAct from "../src/chat/FigureAct.vue";

// the bug shot drawn over the figure's 112-pixel picture with `wallBugs`, its bugs in the picture's pixels, `u` of the way through it
async function drawn(wallBugs, u) {
    const host = document.createElement("div");
    const bug = {pictures: ["data:a", "data:b"], width: 20, height: 12, at: {x: 10, y: 11}};
    createApp({render: () => h(FigureAct, {name: "bug_shot", u, hand: {x: 0.6, y: 0.5, out: 1}, head: {x: 0.5, y: 0.3}, feet: 0.95, size: 112, room: {left: 0, right: 0}, bug, wallBugs})}).mount(host);
    await nextTick();
    return host;
}

test("the bug shot draws each bug still crawling on its wall, its feet to the wall, and a shot one leaves nothing where it sat", async () => {
    const bugs = [
        {x: -380, y: 40, turn: 90, shot: true},
        {x: 120, y: -460, turn: 180, shot: false},
        {x: 480, y: -100, turn: -90, shot: false},
    ];
    const host = await drawn(bugs, 0.4);
    const crawling = [...host.querySelectorAll("[data-act-bug]")].map((image) => image.parentElement.getAttribute("transform"));
    expect(crawling).toEqual(["translate(120 -460) rotate(180)", "translate(480 -100) rotate(-90)"]);
    expect(host.querySelectorAll("[data-act-splat], [data-act-splash], [data-act-slush], [data-act-lens]").length, "no mark, no slush, no drop of the shot bug's before its burst is drawn").toBe(0);
    expect(host.innerHTML).not.toContain("translate(-380 40)");
    // none drawn on the floor beside the figure, as the mallet's bug is
    expect(host.querySelectorAll("image").length).toBe(2);
});
