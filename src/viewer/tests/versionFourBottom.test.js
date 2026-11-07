import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const read = (path) => readFileSync(resolve(__dirname, path), "utf8");

// task 5476: version 4 docks items at the bottom of the chat, above the composer
test("the chat draws its docked items between the history and the composer", () => {
    const chat = read("../../core/modules/messages/web/src/Chat.vue");
    const history = chat.indexOf('class="history"');
    const docks = chat.indexOf("<DockStack");
    const composer = chat.indexOf("<form data-figure-home :class=\"['composer'");
    expect(history).toBeGreaterThan(-1);
    expect(docks).toBeGreaterThan(history);
    expect(composer).toBeGreaterThan(docks);
});

// task 5476: version 4's buttons carry no border unless they are one of the few outlined ones (Open, Dump files)
test("a button has no visible border unless it is asked to be bordered", () => {
    const button = read("../src/kit/Btn.vue");
    expect(button).toMatch(/\.btn \{[^}]*border: 1px solid transparent;/);
    expect(button).toMatch(/\.btn\.bordered \{\s*border-color: var\(--border-2\);/);
});

test("the dock's text action buttons and Dump files are the bordered ones", () => {
    expect(read("../src/chat/DockWrapper.vue")).toMatch(/<Btn\s+small\s+:variant="button\.primary \? 'primary' : 'ghost'"\s+:bordered="!button\.primary"\s+:data-dock-action="button\.action"/);
    expect(read("../../core/modules/messages/web/src/Chat.vue")).toMatch(/<Btn small bordered class="composer-send" data-dump-files/);
});

// task 5476: the sidebar and the breadcrumb as version 4 drew them
test("docked cards stand together inside the stack's border", () => {
    expect(read("../src/chat/DockStack.vue")).toMatch(/\.dock-stack \{[^}]*flex-direction: column;[^}]*border: 1px solid var\(--border\);/);
    expect(read("../src/chat/DockStack.vue")).not.toMatch(/\.dock-stack \{[^}]*gap:/);
});

test("the sidebar has a header, a fold per module, counts and a foot, and the page a breadcrumb", () => {
    const sidebar = read("../src/shell/SidebarPages.vue");
    expect(sidebar).toContain("sidebar-head");
    expect(sidebar).toContain("fold-head");
    expect(sidebar).toContain("item-count");
    expect(sidebar).toContain("sidebar-foot");
    expect(read("../src/windows/PaneStage.vue")).toMatch(/<Breadcrumb :environment="environment" :project="project">/);
    expect(read("../src/shell/Breadcrumb.vue")).toContain("data-breadcrumb");
});

test("the settings page has a search, a list of sections and a filled switch", () => {
    const tree = read("../../core/modules/settings/web/src/SettingsTree.vue");
    expect(tree).toContain("<SearchBar");
    expect(tree).toContain("settings-nav");
    expect(read("../../core/modules/settings/web/src/SettingNode.vue")).toMatch(/\.setting-switch\[aria-checked="true"\] \{[^}]*background: var\(--accent\)/);
});

// task 5476/5489: an icon button never stretches to the height of its bar
test("an icon button is a fixed small square, centred in its row", () => {
    expect(read("../src/kit/Btn.vue")).toMatch(/\.btn\.icon \{[^}]*flex: none;[^}]*align-self: center;[^}]*width: 24px;[^}]*height: 24px;/);
});

// task 5489: the pins run edge to edge under the tab bar, out past the pane's padding
test("the pins strip runs flush with the chat's sides, with no gap to the history below", () => {
    expect(read("../../core/modules/messages/web/src/Chat.vue")).toMatch(/\.pins \{[^}]*margin: 0 -12px -8px;/);
});

// task 5489: one shared skeleton, shaped like what is loading, in every list and every window that is still loading
test("every module window that tracks loading shows the shared skeleton or lists through RowList", async () => {
    const {readdirSync} = await import("node:fs");
    const roots = ["../../core/modules", "../../suites/coding/web", "../../suites/coding/modules"];
    const files = [];
    const walk = (dir) => {
        for (const entry of readdirSync(resolve(__dirname, dir), {withFileTypes: true})) {
            if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== "dist") walk(`${dir}/${entry.name}`);
            else if (entry.name.endsWith(".vue") && dir.includes("/web/src")) files.push(`${dir}/${entry.name}`);
        }
    };
    roots.forEach(walk);
    // SkillRows only hands its first read to LoadedSkills, which lists through RowList
    const loading = files.filter((file) => /\bloaded\b/.test(read(file)) && !file.endsWith("SkillRows.vue"));
    expect(loading.length).toBeGreaterThan(10);
    for (const file of loading) expect(read(file), file).toMatch(/RowList|RowCards|Skeleton|<EmptyState[^>]*:loading/);
});

test("a list shows the skeleton in the shape it was given until its first read answers, then fades the rows in", () => {
    const list = read("../kit/RowList.vue");
    expect(list).toContain('<Skeleton :shape="shape" />');
    expect(list).toMatch(/animation: row-list-in/);
    expect(read("../src/windows/PageWindow.vue")).toContain('<WindowSkeleton :parts="entry.skeleton" />');
});

// task 6443: the docks stack up to the top of the chat, and scroll only when they are taller than it
test("the docks at the foot of the chat take the height they need and scroll past the top of the chat", () => {
    const chat = read("../../core/modules/messages/web/src/Chat.vue");
    expect(chat).toMatch(/<div data-figure-chat-foot class="chat-foot">/);
    expect(chat).toMatch(/\.chat-foot \{[^}]*flex: 0 1 auto;[^}]*min-height: 0;[^}]*overflow-y: auto;/);
    expect(chat).not.toMatch(/\.chat-foot \{[^}]*max-height/);
});
