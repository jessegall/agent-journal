import json
import sys

from core.base.query.queries import Queries
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.processes.models.process import Process
from tests.stories.core.modules.plugins.event_guard import LOCK_CHECK
from tests.stories.core.modules.plugins.support.checkout_stories import ORDER, checkout_story, real
from tests.stories.core.modules.plugins.support.event_stories import EVENT_SCRIPTS, plugin_row, script_calls
from tests.stories.core.modules.plugins.support.runner_binaries import real_runner_at, recording_runner_at

SECRET_NAME = "secrets.txt"
TRY_KEY = "suites.coding.workers.worker_worktree.cut"
TOLD = '{"v": 1, "tell": "the worktree is tidy", "cards": [{"kind": "state", "key": "tidy", "label": "Tidy"}]}'
TOLD_SCRIPT = f"echo '{TOLD}'"
ROOT_MARK = "ran at the root"


def test_s53_a_worker_cannot_read_a_project_file_by_asking(new_story):
    story = checkout_story(new_story)
    story.repository.uncommitted(SECRET_NAME, "the secret\n")
    story.expect_refusal(f"plugin file {SECRET_NAME} --from project", SECRET_NAME, actor=story.worker)
    story.expect_no_text(f"plugin file {SECRET_NAME} --from project", "the secret", actor=story.worker)


def test_s53_a_worker_cannot_name_another_agent(new_story):
    story = checkout_story(new_story)
    story.expect_refusal(f"plugin file {ORDER} --agent {story.agent.id}", "only itself", actor=story.worker)


def worker_with_tools(new_story):
    story = checkout_story(new_story)
    tools = story.worktree / "tools"
    tools.mkdir()
    (tools / "journal-run").write_text(f'pwd > where.txt\necho "{ROOT_MARK}"\n')
    return story


def test_s58_plugin_run_runs_by_relative_path_at_the_root_of_the_worktree_with_the_sandbox_of_the_worker(new_story):
    story = worker_with_tools(new_story)
    recorded = recording_runner_at(story.home)
    outcome = story.run(f"plugin run --agent {story.worker.id} -- sh ./tools/journal-run", actor=story.user)
    story.expect_rows(outcome.code == 0, ROOT_MARK in outcome.output_text)
    call = json.loads(recorded.read_text())
    story.expect_rows(call["folder"] == real(story.worktree), "--read-only-shell" in call["arguments"], str(story.worktree) in call["arguments"][call["arguments"].index("--write-folder") + 1])
    story.expect_rows(call["session"] == "", (story.worktree / "where.txt").read_text().strip() == real(story.worktree))


def test_s58_the_output_of_plugin_run_has_a_number(new_story):
    story = worker_with_tools(new_story)
    recording_runner_at(story.home)
    before = {process.id for process in story.container.get(Queries).query(Process).all_rows()}
    outcome = story.run(f"plugin run --agent {story.worker.id} -- sh ./tools/journal-run", actor=story.user)
    made = [process.id for process in story.container.get(Queries).query(Process).all_rows() if process.id not in before]
    story.expect_rows(outcome.code == 0, len(made) == 1)
    story.expect_rows(str(made[0]) in outcome.output_text)


def test_s58_a_slow_command_holds_no_lock(new_story):
    story = checkout_story(new_story)
    check = story.worktree / "check.sh"
    check.write_text(f"""'{sys.executable}' -c '{LOCK_CHECK}' '{story.home.database}' > lock.txt\n""")
    recording_runner_at(story.home)
    outcome = story.run(f"plugin run --agent {story.worker.id} -- sh ./check.sh", actor=story.user)
    story.expect_rows(outcome.code == 0)
    story.expect_rows((story.worktree / "lock.txt").read_text() == "free\n")


def test_s58_a_write_outside_the_worktree_fails(new_story):
    story = checkout_story(new_story)
    real_runner_at(story.home)
    outside = story.repository.folder / "written-by-the-run.txt"
    story.run(f"plugin run --agent {story.worker.id} -- touch {outside}", actor=story.user)
    inside = story.run(f"plugin run --agent {story.worker.id} -- touch inside.txt", actor=story.user)
    story.expect_rows(inside.code == 0, (story.worktree / "inside.txt").exists(), not outside.exists())


def tried_story(new_story, script: str):
    story = checkout_story(new_story, {"event": TRY_KEY, "commit": "try.sh"}, scripts={"try.sh": script}, name="tidy-worktrees", program="try.sh")
    story.run_listeners()
    story.calls_before = len(script_calls(story, "try.sh", "tidy-worktrees"))
    story.refusals_before = len(story.refusals())
    return story


def test_s61_trying_a_script_prints_the_line_and_the_answer_and_leaves_nothing(new_story):
    story = tried_story(new_story, TOLD_SCRIPT)
    story.expect_text(f"plugin try tidy-worktrees {TRY_KEY} --agent {story.worker.id}", TRY_KEY, "the worktree is tidy", actor=story.user)
    story.expect_rows(len(script_calls(story, "try.sh", "tidy-worktrees")) == story.calls_before + 1)
    story.run_listeners()
    story.expect_rows(not list(story.container.get(Queries).query(PluginOutput).all_rows()), len(story.refusals()) == story.refusals_before)
    story.expect_no_text("chat-mark list --environment 1", "Tidy", actor=story.user)


def test_s61_trying_a_script_that_fails_leaves_no_fault(new_story):
    story = tried_story(new_story, EVENT_SCRIPTS["fail.sh"])
    story.expect_text(f"plugin try tidy-worktrees {TRY_KEY} --agent {story.worker.id}", TRY_KEY, "3", actor=story.user)
    story.run_listeners()
    story.expect_rows(plugin_row(story, "tidy-worktrees").fault_count == 0)


def test_s61_trying_a_key_with_no_event_yet_uses_an_empty_row(new_story):
    story = checkout_story(new_story, {"event": "core.pins.pin.created", "commit": "try.sh"}, scripts={"try.sh": TOLD_SCRIPT}, name="tidy-worktrees", program="try.sh")
    story.expect_text("plugin try tidy-worktrees core.pins.pin.created", "core.pins.pin.created", "the worktree is tidy", actor=story.user)
