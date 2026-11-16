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


def story_with_graphify(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    runner = story.container.get(RunnerBinary).path
    FileAccess.mkdir(runner.parent, parents=True, exist_ok=True)
    FileAccess.write(runner, LINE_RUNNER.replace("$JOURNAL_STORY_HOME", str(story.home.folder.resolve())))
    FileAccess.chmod(runner, 0o755)
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


def test_one_update_at_a_time_at_most_every_few_minutes_and_grouping_on_its_own_interval(new_story, tmp_path):
    story, repo = story_with_graphify(new_story, tmp_path)
    story.expect_success("tool on graphify", actor=story.user)
    different = GraphifyRepo(tmp_path, "other")
    repo.block_graphify()
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    repo.poll_calls(1)
    repo.commit("second")
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    story.expect_success(f"{TICK} {different.folder}", actor=story.agent)
    story.expect_text(f"tool refresh graphify --folder {repo.folder}", "refreshing", actor=story.agent)
    story.expect_rows(repo.call_count() == 1, not (different.folder / "graphify-out/.journal-running").exists())
    repo.release_graphify()
    repo.wait(repo.folder / "graphify-out", lambda: not (repo.folder / "graphify-out/.journal-running").exists())
    ended_updates(story)
    repo.age_graph(story.clock.unix_seconds(), HOUR_SECONDS)
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    repo.poll_refresh()
    ended_updates(story)
    story.expect_rows(repo.call_count() == 2)
    for message in ("third", "fourth", "fifth", "sixth", "seventh"):
        repo.commit(message)
        story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    story.expect_rows(repo.call_count() == 2)
    repo.age_graph(story.clock.unix_seconds(), 3 * HOUR_SECONDS)
    story.expect_success(f"{TICK} {repo.folder}", actor=story.agent)
    repo.poll_refresh()
    story.expect_rows(repo.arguments()[-3:] == ["update .", "update . --no-cluster", "update ."])



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






def test_the_tools_window_is_a_project_page_that_reads_the_list_and_runs_its_buttons(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_declared_window("tools.tools", "component", "page")
    window.expect_window_allowed("tools.tools", "tool list")
    window.expect_window_allowed("tools.tools", "tool on graphify")
    window.expect_window_allowed("tools.tools", "tool off graphify")
    window.expect_window_allowed("tools.tools", "tool install graphify")
    window.expect_window_allowed("tools.tools", "tool refresh graphify")

