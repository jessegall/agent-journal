import pytest

import io
import json
import shlex
import sys

from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.process.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.processes.models.process import Process
from tests.stories.core.modules.plugins.event_guard import LOCK_CHECK
from tests.stories.core.modules.plugins.support.checkout_stories import ORDER, checkout_story, real
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE
from tests.stories.core.modules.plugins.support.event_stories import EVENT_SCRIPTS, event_plugin_story, plugin_row, script_calls
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.plugins.support.runner_binaries import recording_runner_at

SECRET_NAME = "secrets.txt"
TRY_KEY = "suites.coding.workers.worker_worktree.cut"
SCRIPT_ANSWER = '{"v": 1, "tell": "the worktree is tidy", "cards": [{"kind": "state", "key": "tidy", "label": "Tidy"}]}'
ANSWER_SCRIPT = f"echo '{SCRIPT_ANSWER}'"
ROOT_MARK = "ran at the root"


@pytest.fixture
def prepared_checkout(new_story):
    return checkout_story(new_story)



def test_s53_a_worker_cannot_leave_its_checkout_with_dots(prepared_checkout):
    story = prepared_checkout
    story.repository.uncommitted(SECRET_NAME, "the secret\n")
    for line in (f"plugin file ../../../../{SECRET_NAME}", f"plugin file ../../../../{SECRET_NAME} --from project", f"plugin file {story.repository.folder / SECRET_NAME}"):
        story.expect_refusal(line, "leaves the checkout", actor=story.worker)
        story.expect_no_text(line, "the secret", actor=story.worker)


def test_s53_a_worker_reads_its_own_checkout_and_a_declared_folder_of_the_project(new_story):
    story = checkout_story(new_story, setup_repository=lambda story: story.repository.library(".rules", "config.json", "the rules\n"), project_reads=[".rules"])
    story.repository.uncommitted(SECRET_NAME, "the secret\n")
    story.expect_text(f"plugin file {ORDER}", "ORDER", actor=story.worker)
    story.expect_text("plugin file .rules/config.json --from project", "the rules", actor=story.worker)
    story.expect_refusal(f"plugin file {SECRET_NAME} --from project", "read limit", actor=story.worker)


def test_s53_the_limit_of_an_agent_does_not_hold_a_line_from_a_plugin_script(new_story):
    story = checkout_story(new_story)
    story.repository.uncommitted(SECRET_NAME, "the secret\n")
    caller = Caller(story.worker, 1, plugin_script="events")
    code = story.container.get(Console).run(shlex.split(f"plugin file {SECRET_NAME} --from project --agent {story.agent.id}"), caller, io.StringIO())
    story.expect_rows(code == 0)


def worker_with_tools(new_story):
    story = checkout_story(new_story)
    tools = story.worktree / "tools"
    tools.mkdir()
    (tools / "journal-run").write_text(f'pwd > where.txt\necho "{ROOT_MARK}"\n')
    return story


def test_s58_the_output_of_plugin_run_has_a_number(new_story):
    story = worker_with_tools(new_story)
    recording_runner_at(story.home)
    existing_process_ids = {process.id for process in story.story_rows(Process)}
    outcome = story.run(f"plugin run --agent {story.worker.id} -- sh ./tools/journal-run", actor=story.user)
    new_process_ids = [process.id for process in story.story_rows(Process) if process.id not in existing_process_ids]
    story.expect_rows(outcome.code == 0, len(new_process_ids) == 1)
    story.expect_rows(str(new_process_ids[0]) in outcome.output_text)


def test_s58_a_slow_command_holds_no_lock(new_story):
    story = checkout_story(new_story)
    check = story.worktree / "check.sh"
    check.write_text(f"""'{sys.executable}' -c '{LOCK_CHECK}' '{story.home.database}' > lock.txt\n""")
    recording_runner_at(story.home)
    outcome = story.run(f"plugin run --agent {story.worker.id} -- sh ./check.sh", actor=story.user)
    story.expect_rows(outcome.code == 0)
    story.expect_rows((story.worktree / "lock.txt").read_text() == "free\n")


def test_s58_an_agent_may_not_use_plugin_run_even_naming_itself(new_story):
    story = worker_with_tools(new_story)
    recorded = recording_runner_at(story.home)
    story.expect_refusal(f"plugin run --agent {story.worker.id} -- true", "may not use", actor=story.worker)
    story.expect_refusal("plugin run -- true", "may not use", actor=story.worker)
    story.expect_rows(not recorded.exists())


def test_s58_a_plugin_script_may_run_for_an_agent_and_the_run_is_listed_for_its_plugin(new_story):
    story = worker_with_tools(new_story)
    tools = story.worktree / "tools" / "journal-run"
    tools.write_text("cat listed.txt\n")
    (story.worktree / "listed.txt").write_text("listed\n")
    recording_runner_at(story.home)
    caller = Caller(story.user, 1, plugin_script="events")
    stream = io.StringIO()
    code = story.container.get(Console).run(shlex.split(f"plugin run --agent {story.worker.id} -- sh ./tools/journal-run"), caller, stream)
    story.expect_rows(code == 0, "listed" in stream.getvalue(), not story.container.get(PluginScriptProcesses).running("events"))


def test_s58_the_main_checkout_gets_no_sandbox_unless_it_asks_for_read_only(new_story):
    story = worker_with_tools(new_story)
    recorded = recording_runner_at(story.home)
    story.expect_success(f"plugin run --agent {story.agent.id} -- true", actor=story.user)
    story.expect_rows("--read-only-shell" not in json.loads(recorded.read_text())["arguments"])
    story.expect_success(f"plugin run --agent {story.agent.id} --read-only -- true", actor=story.user)
    story.expect_rows("--read-only-shell" in json.loads(recorded.read_text())["arguments"])


def tried_story(new_story, script: str):
    story = checkout_story(new_story, {"event": TRY_KEY, "commit": "try.sh"}, scripts={"try.sh": script}, name="tidy-worktrees", program="try.sh")
    story.run_listeners()
    story.calls_before = len(script_calls(story, "try.sh", "tidy-worktrees"))
    story.refusals_before = len(story.refusals())
    story.outputs_before = len(list(story.story_rows(PluginOutput)))
    story.faults_before = plugin_row(story, "tidy-worktrees").fault_count
    return story


def test_s61_trying_a_script_prints_the_line_and_the_answer_and_leaves_nothing(new_story):
    story = tried_story(new_story, ANSWER_SCRIPT)
    story.expect_text(f"plugin try tidy-worktrees {TRY_KEY} --agent {story.worker.id}", TRY_KEY, "the worktree is tidy", actor=story.user)
    story.expect_rows(len(script_calls(story, "try.sh", "tidy-worktrees")) == story.calls_before + 1)
    story.run_listeners()
    story.expect_rows(len(list(story.story_rows(PluginOutput))) == story.outputs_before, len(story.refusals()) == story.refusals_before)
    story.expect_no_text("chat-mark list --environment 1", "Tidy", actor=story.user)


def test_s61_the_inputs_of_a_plugin_show_a_held_event_that_has_no_row(new_story):
    story = install_runner(event_plugin_story(new_story, program="see.sh", hears=["command_starting"], holds=["command_starting"]))
    story.hook("s-1", LISTING_SAMPLE)
    story.expect_text("plugin record events --inputs", "command_starting", actor=story.user)
