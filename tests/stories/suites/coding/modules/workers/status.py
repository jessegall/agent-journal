import json

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from tests.stories.support.story_checks import expect_value
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.phase_steps import worker_on_plan


@pytest.fixture
def worker_batch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success('task make "Tax" --brief "Calculate tax" --environment main')
    story.expect_success('task make "Receipt" --brief "Print receipt" --environment main')
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1 2 3", actor=story.agent), ActorType.AGENT)
    return story, repository, worker


def test_after_a_compaction_a_worker_is_held_until_it_has_read_its_status(worker_batch):
    story, _, worker = worker_batch
    session = worker_session(story, worker)
    story.hook(session, HookSamples.session_start().with_raw({"source": "compact"}))
    story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "run journal worker status first")
    story.expect_text("worker status", "Skills to load: ", actor=worker)
    story.expect_hook_allowed(session, HookSamples.shell("journal worker status", ShellPart("journal", CommandCategory.JOURNAL, ["worker", "status"], subcommand="worker")))
    story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


def test_a_worker_reads_its_current_task_and_remaining_assignments(worker_batch):
    story, _, worker = worker_batch
    status = json.loads(story.run("worker status --json", actor=worker).output_text)
    story.expect_rows(status["worker_id"] == worker.id, status["current_task"]["id"] == 1,
                      status["current_task"]["state"] == "started", status["tests"]["total"] == 0,
                      [task["id"] for task in status["assignments"]["rows"]] == [2, 3])


def test_a_worker_in_a_phase_reads_the_phase_and_the_tasks_waiting_for_its_end(new_story, monkeypatch):
    on_plan = worker_on_plan(new_story, monkeypatch)
    on_plan.prove_and_move_on()
    on_plan.story.expect_text("worker status", "Current phase: phase 1 (Build)", "Tasks waiting for its end: 1", actor=on_plan.worker)
    status = json.loads(on_plan.story.run("worker status --json", actor=on_plan.worker).output_text)
    expect_value(status["phase"] == {"id": 1, "title": "Build", "tasks_waiting": 1}, True)


def test_the_status_of_a_worker_outside_a_plan_names_no_phase(worker_batch):
    story, _, worker = worker_batch
    story.expect_no_text("worker status", "phase", actor=worker)
    story.expect_rows(json.loads(story.run("worker status --json", actor=worker).output_text)["phase"] is None)


def test_the_main_agent_reads_a_workers_status_in_pages(worker_batch):
    story, _, worker = worker_batch
    status = json.loads(story.run(f"worker status {worker.id} --page 2 --limit 1 --json", actor=story.agent).output_text)
    story.expect_rows(status["assignments"]["total"] == 2, status["assignments"]["page"] == 2,
                      [task["id"] for task in status["assignments"]["rows"]] == [3])


def test_worker_status_lists_tests_waiting_for_the_queue(worker_batch, monkeypatch):
    story, repository, worker = worker_batch
    monkeypatch.setattr(WorkerTestLaunch, "start", lambda *_arguments: None)
    story.expect_success("setting make journal.core.processes.run-batch-size 0 --environment main")
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart story" --test "pytest tests/cart.py"', actor=worker)
    story.expect_success("worker next --differences none", actor=worker)
    story.run_listeners()
    status = json.loads(story.run(f"worker status {worker.id} --json", actor=story.agent).output_text)
    story.expect_rows(status["current_task"]["state"] == "testing", status["tests"]["total"] == 1,
                      status["tests"]["rows"][0]["test_command"] == "pytest tests/cart.py")
    story.expect_text(f"worker status {worker.id}", "Current task: 1", "Tests waiting: 1", "Assignments remaining: 2", actor=story.agent)


def test_status_without_a_worker_names_the_missing_worktree(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_text("worker status", "has no worker worktree", actor=story.agent)


def test_status_refuses_an_unbounded_page(worker_batch):
    story, _, worker = worker_batch
    story.expect_text("worker status --limit 101", "a limit from 1 to 100", actor=worker)
    story.expect_text("worker status --page 0", "a positive page", actor=worker)


def test_worker_status_names_the_programs_skill_loading_method(worker_batch):
    story, _, worker = worker_batch
    story.expect_success(f"skill require {worker.id} journal-tasks")
    story.expect_text("worker status", "load this first with the Skill tool: journal-tasks", actor=worker)


def test_a_refused_status_read_does_not_release_the_compaction_block(worker_batch):
    story, _, worker = worker_batch
    session = worker_session(story, worker)
    story.hook(session, HookSamples.session_start().with_raw({"source": "compact"}))
    piped = ShellPart("journal", CommandCategory.JOURNAL, ["worker", "status"], subcommand="worker", pipe_target=1)
    reader = ShellPart("cat", CommandCategory.READ, [])
    story.expect_hook_refusal(session, HookSamples.shell("journal worker status && cat", piped, reader), "run the read command directly, without a pipe or redirect")
    story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "run journal worker status first")
    story.expect_success("worker status", actor=worker)
    story.expect_hook_allowed(session, HookSamples.shell("journal worker status", ShellPart("journal", CommandCategory.JOURNAL, ["worker", "status"], subcommand="worker")))
    story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))
