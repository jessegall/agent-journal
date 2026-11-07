import json

from core.base.driver.command_category import CommandCategory
from core.testing.expect_reply import expect_reply_allowed, expect_reply_refusal
from core.testing.shell_part import ShellPart
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, worker_on_plan, worker_outside_plan
from tests.stories.suites.coding.modules.workers.test_batches import BATCH, PHASE, configure
from tests.stories.suites.coding.modules.workers.test_queue import affected_test_story, ended


def test_s32_the_phase_setting_off_tests_each_plan_task_whatever_the_outside_batch_size(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch, build_test="pytest tests/phase.py")
    configure(worker, PHASE, "off")
    configure(worker, BATCH, "4")
    for _ in range(4):
        expect_reply_allowed(worker.run_test())
    worker.change_and_prove(TEST_LINE)
    worker.story.expect_text("worker next --wait --differences none", "tests of task 1", actor=worker.worker)
    worker.story.expect_rows(len(worker.started) == 1, worker.current_task() == 1)


def test_s33_a_batch_outside_a_plan_runs_its_proofs_together_when_its_size_is_reached(new_story, monkeypatch):
    worker = worker_outside_plan(new_story, monkeypatch)
    UserJoined().steps(worker.story)
    configure(worker, BATCH, "2")
    worker.prove_and_move_on(TEST_LINE)
    worker.story.expect_rows(worker.current_task() == 2, len(worker.started) == 0)
    worker.prove(TEST_LINE)
    worker.story.expect_text("worker deliver --wait --differences none", "tests of batch", actor=worker.worker)
    worker.end_all_tests()
    worker.story.expect_rows(len(worker.started) == 2)
    worker.story.expect_text("task show 1", "state: completed", actor=worker.story.agent)
    worker.story.expect_text("task show 2", "state: completed", actor=worker.story.agent)


RUNS = "journal.suites.coding.workers.worker-phase-test-runs"
COMMAND_TYPES = "journal.suites.coding.worker-command-types"


def test_s34_a_zero_allowance_sends_the_first_grouped_test_command_to_the_main_agent_for_approval(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch)
    configure(worker, RUNS, "0")
    expect_reply_refusal(worker.run_test(), "--ask-main")


def test_s34_a_settings_edit_between_commands_keeps_the_commands_already_used(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch)
    expect_reply_allowed(worker.run_test())
    configure(worker, RUNS, "1")
    expect_reply_refusal(worker.run_test(), "--ask-main")
    configure(worker, RUNS, "3")
    expect_reply_allowed(worker.run_test())


def test_s36_adding_version_control_to_the_worker_command_types_does_not_allow_a_worker_git(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch)
    configure(worker, COMMAND_TYPES, json.dumps(["read", "search", "edit", "test run", "build", "version control"]))
    expect_reply_refusal(worker.run_line("git status", ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"])), "a worker runs no git")


def test_s37_the_picked_files_become_the_arguments_of_the_project_test_command(new_story, monkeypatch):
    story, _, _, started = affected_test_story(new_story, monkeypatch)
    story.container.get(OutputFolder).write_output(started[1], 1, "tests/cart.py\n")
    ended(story, started[1], 0)
    story.expect_rows(story.container.get(Queries).query(Process).find(started[2]).line == "python3 -m pytest -q tests/cart.py")
    ended(story, started[2], 0)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_s38_a_failed_selected_test_returns_the_work_and_no_full_suite_follows(new_story, monkeypatch):
    story, _, _, started = affected_test_story(new_story, monkeypatch)
    story.container.get(OutputFolder).write_output(started[1], 1, "tests/cart.py\n")
    ended(story, started[1], 0)
    ended(story, started[2], 1)
    story.expect_rows(len(started) == 3)
    story.expect_text("task show 1", "state: started", actor=story.agent)
