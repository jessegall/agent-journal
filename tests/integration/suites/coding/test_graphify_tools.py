from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.commands.end_process.end_process import EndProcess
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.enums.process_type import ProcessType
from engine.actor.actor import Actor
from engine.file.file_access import FileAccess
from core.modules.processes.support.runner_binary import RunnerBinary
import json

from engine.provider.managed_hooks import ManagedHooks
from core.modules.tools.support.tools import Tools
from tests.stories.suites.coding.support.graphify_repo import COMMAND_SETTING, INSTALL_SETTING, GraphifyRepo
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

TICK = "tool tick graphify --folder"
HOUR_SECONDS = 3600
TEST_ROWS_REASON = "the test reads every row it checks"


# stands in for the journal's runner: it runs the line after its flags at once, as a granted run starts
LINE_RUNNER = ('#!/bin/sh\nslot="$JOURNAL_STORY_HOME/processes/$2/slot"\nwhile [ ! -e "$slot" ]; do sleep 0.05; done\n'
               'while [ "$#" -gt 0 ] && [ "$1" != "--" ]; do shift; done\nshift\nexec sh -c "$1"\n')


def ended_updates(story) -> None:
    """Ends the process rows of the updates whose line has finished, as the journal's runner reports a finished line."""
    updates = story.container.get(Queries).query(Process).filter(run_name=ProcessType.GRAPHIFY.value).matching(Among("state", RUNNING_STATES)).every_row(TEST_ROWS_REASON)
    for update in updates:
        story.run_command(EndProcess(update.id, 0, 0, 0), Actor.core(), environment_id=update.environment_id)


def story_with_graphify(played, tmp_path):
    story = played(UserJoined)
    runner = story.container.get(RunnerBinary).path
    FileAccess.mkdir(runner.parent, parents=True, exist_ok=True)
    FileAccess.write(runner, LINE_RUNNER.replace("$JOURNAL_STORY_HOME", str(story.home.folder.resolve())))
    FileAccess.chmod(runner, 0o755)
    repo = GraphifyRepo(tmp_path)
    story.expect_success(f"setting set {COMMAND_SETTING} {repo.script} --project", actor=story.user)
    return story, repo


def tool_hooks(story):
    return [hook for hook in story.container.get(ManagedHooks).all() if "tool tick graphify" in hook.command]











def test_installing_graphify_writes_no_search_hook_for_an_agent_program(played, tmp_path):
    story, _ = story_with_graphify(played, tmp_path)
    writer = tmp_path / "hook-writing-graphify"
    settings = {"hooks": {"PreToolUse": [{"matcher": "Grep", "hooks": [{"type": "command", "command": "graphify-guard"}]}]}}
    writer.write_text(f"#!/bin/sh\nif [ \"$1\" = claude ]; then mkdir -p .claude; echo '{json.dumps(settings)}' > .claude/settings.json; fi\n")
    writer.chmod(0o755)
    story.expect_success(f"setting set {COMMAND_SETTING} {writer} --project", actor=story.user)
    story.expect_success(f"setting set {INSTALL_SETTING} true --project", actor=story.user)
    story.expect_success("tool install graphify", actor=story.user)
    commands = [hook.command for hook in story.container.get(ManagedHooks).all()]
    story.expect_rows("graphify-guard" not in commands, detail=str(commands))






def test_a_new_worktree_gets_a_copy_of_the_graph_files_without_the_cache_only_while_graphify_is_on(played, tmp_path):
    story, repo = story_with_graphify(played, tmp_path)
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


def test_a_removed_worktree_folder_is_not_made_again_for_the_graph(played, tmp_path):
    story, repo = story_with_graphify(played, tmp_path)
    source = tmp_path / "source"
    target = tmp_path / "removed"
    (source / "graphify-out").mkdir(parents=True)
    (source / "graphify-out/graph.json").write_text("graph")
    story.expect_success("tool on graphify", actor=story.user)
    story.expect_rows(story.container.get(Tools).worktree_outputs(str(source), str(target)) == [], not target.exists())



