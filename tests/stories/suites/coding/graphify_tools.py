import json

from engine.provider.managed_hooks import ManagedHooks
from core.modules.tools.support.tools import Tools
from tests.stories.suites.coding.support.graphify_repo import COMMAND_SETTING, INSTALL_SETTING, GraphifyRepo
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

TICK = "tool tick graphify --folder"


def story_with_graphify(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    repo = GraphifyRepo(tmp_path)
    story.expect_success(f"setting set {COMMAND_SETTING} {repo.script} --project", actor=story.user)
    return story, repo


def tool_hooks(story):
    return [hook for hook in story.container.get(ManagedHooks).all() if "tool tick graphify" in hook.command]


def test_turning_graphify_off_removes_its_managed_hooks(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    story.expect_success("tool on graphify", actor=story.user)
    story.expect_text("tool off graphify", "graphify: off", actor=story.user)
    story.expect_rows(tool_hooks(story) == [])


def test_no_second_update_starts_while_one_runs(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    repo.block_graphify()
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    repo.poll_calls(1)
    repo.commit("second")
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    story.expect_text(f"tool refresh graphify --folder {repo.folder}", "refreshing", actor=story.agent)
    story.expect_rows(repo.call_count() == 1)
    repo.release_graphify()
    repo.wait(repo.folder / "graphify-out", lambda: not (repo.folder / "graphify-out/.journal-running").exists())
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    repo.poll_refresh()
    story.expect_rows(repo.call_count() == 2)


def test_the_card_shows_installed_on_and_the_last_refresh_and_refresh_now_updates_the_project(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    project = GraphifyRepo(tmp_path, "project")
    story.expect_success(f"setting set {COMMAND_SETTING} {project.script} --project", actor=story.user)
    story.expect_success(f"tool refresh graphify --folder {project.folder}", actor=story.user)
    project.poll_refresh()
    story.expect_success("tool on graphify", actor=story.user)
    card = json.loads(story.run("tool list --json", actor=story.user).output_text)["tools"][0]
    story.expect_rows(card["is_installed"] is True, card["enabled"] is True)


def test_refresh_now_is_refused_while_graphify_is_not_installed(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    story.expect_success(f"setting set {COMMAND_SETTING} {tmp_path / 'missing-graphify'} --project", actor=story.user)
    story.expect_text("tool list", "not installed", actor=story.user)
    story.expect_refusal(f"tool refresh graphify --folder {repo.folder}", "not installed", actor=story.user)
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    story.expect_rows(repo.call_count() == 0)


def test_installing_graphify_writes_no_search_hook_for_an_agent_program(new_story, tmp_path):
    story, _ = story_with_graphify(new_story, tmp_path)
    writer = tmp_path / "hook-writing-graphify"
    settings = {"hooks": {"PreToolUse": [{"matcher": "Grep", "hooks": [{"type": "command", "command": "graphify-guard"}]}]}}
    writer.write_text(f"#!/bin/sh\nif [ \"$1\" = claude ]; then mkdir -p .claude; echo '{json.dumps(settings)}' > .claude/settings.json; fi\n")
    writer.chmod(0o755)
    story.expect_success(f"setting set {COMMAND_SETTING} {writer} --project", actor=story.user)
    story.expect_success(f"setting set {INSTALL_SETTING} true --project", actor=story.user)
    story.expect_success("tool install graphify", actor=story.user)
    commands = [hook.command for hook in story.container.get(ManagedHooks).all()]
    story.expect_rows("graphify-guard" not in commands, detail=str(commands))


def test_a_failing_install_is_refused_with_its_last_line(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    installer = tmp_path / "installer"
    installer.write_text("#!/bin/sh\necho no network >&2\nexit 3\n")
    installer.chmod(0o755)
    story.expect_success(f"setting set {INSTALL_SETTING} {installer} --project", actor=story.user)
    story.expect_refusal("tool install graphify", "no network", actor=story.user)


def test_an_unknown_tool_is_refused(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    story.expect_refusal("tool on nothing", "no supported tool", actor=story.user)


def test_a_new_worktree_gets_a_copy_of_the_graph_files_without_the_cache_only_while_graphify_is_on(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    source = tmp_path / "source"
    target = tmp_path / "target"
    (source / "graphify-out").mkdir(parents=True)
    (source / "graphify-out/graph.json").write_text("graph")
    (source / "graphify-out/.journal-running").write_text("1")
    (source / "graphify-out/.rebuild.lock").write_text("1")
    (source / "graphify-out/cache").mkdir()
    (source / "graphify-out/cache/chunk.json").write_text("cached")
    target.mkdir()
    tools = story.container.get(Tools)
    story.expect_rows(tools.worktree_outputs(str(source), str(target)) == [], not (target / "graphify-out").exists())
    story.expect_success("tool on graphify", actor=story.user)
    story.expect_rows(tools.worktree_outputs(str(source), str(target)) == ["graphify-out"], (target / "graphify-out/graph.json").read_text() == "graph",
                      not (target / "graphify-out/.journal-running").exists(), not (target / "graphify-out/.rebuild.lock").exists(),
                      not (target / "graphify-out/cache").exists())


def test_a_removed_worktree_folder_is_not_made_again_for_the_graph(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    source = tmp_path / "source"
    target = tmp_path / "removed"
    (source / "graphify-out").mkdir(parents=True)
    (source / "graphify-out/graph.json").write_text("graph")
    story.expect_success("tool on graphify", actor=story.user)
    story.expect_rows(story.container.get(Tools).worktree_outputs(str(source), str(target)) == [], not target.exists())


def test_the_tools_window_is_a_project_page_that_reads_the_list_and_runs_its_buttons(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_declared_window("tools.tools", "component", "page")
    window.expect_window_allowed("tools.tools", "tool list")
    window.expect_window_allowed("tools.tools", "tool on graphify")
    window.expect_window_allowed("tools.tools", "tool off graphify")
    window.expect_window_allowed("tools.tools", "tool install graphify")
    window.expect_window_allowed("tools.tools", "tool refresh graphify")
