from tests.stories.core.support.agent_labels import agent_number
import json

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment, worker_session
from core.modules.processes.support.process_nudges import READ_COMMAND_OUTPUT
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.processes.models.enums.process_setting import ProcessSetting


@pytest.fixture
def worker_batch(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success('task make "Tax" --brief "Calculate tax" --environment main')
    story.expect_success('task make "Receipt" --brief "Print receipt" --environment main')
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2 3", actor=story.agent), ActorType.AGENT)
    return story, repository, worker


def test_a_worker_reads_its_current_task_and_remaining_assignments(worker_batch):
    story, _, worker = worker_batch
    status = json.loads(story.run("worker status --json", actor=worker).output_text)
    story.expect_rows(status["worker_id"] == worker.id, status["current_task"]["id"] == 1,
                      status["current_task"]["state"] == "started", status["tests"]["total"] == 0,
                      [task["id"] for task in status["assignments"]["rows"]] == [2, 3])


def test_the_main_agent_reads_a_workers_status_in_pages(worker_batch):
    story, _, worker = worker_batch
    status = json.loads(story.run(f"worker status {agent_number(story, worker.id)} --page 2 --limit 1 --json", actor=story.agent).output_text)
    story.expect_rows(status["assignments"]["total"] == 2, status["assignments"]["page"] == 2,
                      [task["id"] for task in status["assignments"]["rows"]] == [3])


def test_worker_status_lists_tests_waiting_for_the_queue(worker_batch, monkeypatch):
    story, repository, worker = worker_batch
    monkeypatch.setattr(WorkerTestLaunch, "start", lambda *_arguments: None)
    monkeypatch.setattr(WorkerTestLaunch, "start_waited", lambda *_arguments: None)
    story.expect_success(f"setting make {ProcessSetting.RUN_BATCH_SIZE.key} 0 --environment main")
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart story" --test "python tests/cart.py"', actor=worker)
    story.expect_success(COMMIT, actor=worker)
    story.run_listeners()
    status = json.loads(story.run(f"worker status {agent_number(story, worker.id)} --json", actor=story.agent).output_text)
    story.expect_rows(status["current_task"]["state"] == "testing", status["tests"]["total"] == 1,
                      status["tests"]["rows"][0]["test_command"] == "pytest tests/cart.py")
    story.expect_text(f"worker status {agent_number(story, worker.id)}", "Current task: 1", "Tests waiting: 1", "Assignments remaining: 2", actor=story.agent)


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
    story.expect_hook_refusal(session, HookSamples.shell("journal worker status && cat", piped, reader), expected_nudge(READ_COMMAND_OUTPUT))
    story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "read your worker status first")
    story.expect_success("worker status", actor=worker)
    story.expect_hook_allowed(session, HookSamples.shell("journal worker status", ShellPart("journal", CommandCategory.JOURNAL, ["worker", "status"], subcommand="worker")))
    story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


def test_557_the_status_of_a_worker_carries_the_standing_the_standing_command_prints(worker_batch):
    story, _, worker = worker_batch
    number = agent_number(story, worker.id)
    standing = json.loads(story.run(f"agent standing {number} --json --environment main", actor=story.agent).output_text)
    status = json.loads(story.run(f"worker status {number} --json", actor=story.agent).output_text)
    story.expect_rows(status["standing"] == standing["standing"], detail=f"{standing} | {status}")
    story.expect_text(f"worker status {number}", f"Standing: {standing['standing']}", actor=story.agent)
