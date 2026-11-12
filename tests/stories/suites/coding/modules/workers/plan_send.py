from tests.stories.core.modules.tasks.support.holder_assignee_check import assignee_of
from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType

from engine.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.suites.coding.modules.workers.kept_workers import stopped
from tests.stories.suites.coding.modules.workers.queued_commands import run_operation
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def joined_person(story):
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)


def assignment_marks(story):
    story.run_listeners()
    return tuple(story.container.get(Queries).query(ChatMark).filter(variant=WorkerMarkVariant.ASSIGNED).oldest().all_rows())


@pytest.fixture
def idle_plan(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    joined_person(story)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success('plan make "Next plan" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "Build"', actor=story.user)
    story.expect_success('phase make --plan 1 "Ship"', actor=story.user)
    for number, phase in ((2, 1), (3, 1), (4, 2)):
        task = story.new_row_id(f'task make "Task {number}" --environment main', actor=story.agent)
        story.expect_success(f"phase place {task} --phase {phase}", actor=story.agent)
    story.expect_success("task block 3 --on task:2", actor=story.agent)
    ready_plan(story, actor=story.user)
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    monkeypatch.setattr(ClaudeCodeProvider, "session_matches_folder", lambda provider, folder, session: True)
    stopped(story, worker)
    return story, worker


def test_idle_worker_refusal_keeps_the_plan_and_phase(idle_plan):
    story, worker = idle_plan
    story.expect_refusal("worker dispatch --test-command python=pytest --model sonnet --plan 1 --phase 1", f"journal worker send {agent_number(story, worker.id)} --plan 1 --phase 1", actor=story.agent)


def test_a_plan_sent_to_an_idle_worker_keeps_its_order_and_blocked_tasks(idle_plan):
    story, worker = idle_plan
    previous = len(assignment_marks(story))
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --plan 1", actor=story.agent)
    marks = assignment_marks(story)
    story.expect_rows(len(marks) == previous + 1, marks[-1].text == f"Worker {worker.id} was given 3 tasks",
                      all(f"Task {number}: Task {number}" in marks[-1].detail for number in (2, 3, 4)), marks[-1].target_id == worker.id)
    tasks = story.container.get(Queries).query(Task).find_many([2, 3, 4])
    story.expect_rows(all(assignee_of(story, task) == worker.id for task in tasks))
    story.expect_text("task show 2", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("plan inspect 1 --json", '"delegated": true', actor=story.agent)


def test_sending_one_phase_leaves_the_other_phase_unassigned(idle_plan):
    story, worker = idle_plan
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --plan 1 --phase 1", actor=story.agent)
    tasks = story.container.get(Queries).query(Task).find_many([2, 3, 4])
    story.expect_rows(assignee_of(story, tasks[0]) == worker.id, assignee_of(story, tasks[1]) == worker.id, assignee_of(story, tasks[2]) is None)


def test_a_large_plan_dispatch_updates_dependencies_without_repeated_reads(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    joined_person(story)
    repository_environment(story)
    story.expect_success('plan make "Many tasks" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "Build"', actor=story.user)
    story.expect_success("phase place 1 --phase 1", actor=story.agent)
    for number in range(2, 15):
        task = story.new_row_id(f'task make "Task {number}" --environment main', actor=story.agent)
        story.expect_success(f"phase place {task} --phase 1", actor=story.agent)
        story.expect_success(f"task block {task} --on task:1", actor=story.agent)
    ready_plan(story, actor=story.user)
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest --model sonnet --plan 1")
    tasks = story.container.get(Queries).query(Task).find_many(list(range(1, 15)))
    story.expect_rows(all(assignee_of(story, task) == worker.id for task in tasks))


def test_a_blocked_task_waits_with_an_idle_worker_and_is_sent_to_it_when_it_opens(idle_plan, monkeypatch):
    story, worker = idle_plan
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda *_args: None)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task 3", actor=story.agent)
    previous = len(assignment_marks(story))
    story.expect_rows(assignee_of(story, story.row(Task, 3)) == worker.id, story.container.get(WorktreeQuery).worker_worktree(worker.id) is None)
    story.expect_success('task cancel 2 --reason "Not needed"', actor=story.agent)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    story.expect_rows(operation.worker_id == worker.id, operation.line == f"worker send {agent_number(story, worker.id)} --task 3 --wait", operation.creator_id == story.agent.id)
    outcome = run_operation(story, operation)
    story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    marks = assignment_marks(story)
    story.expect_rows(len(marks) == previous + 1, marks[-1].text == f"Worker {worker.id} was given task 3", "Task 3: Task 3" in marks[-1].detail)
    story.expect_text("task show 3", "state: started", f"holder_id: {worker.id}", actor=story.agent)


def test_a_task_blocked_for_a_reason_goes_to_a_busy_worker_and_waits_for_its_turn(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda *_args: None)
    task = story.new_row_id('task make "Later work" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --reason "Waits on the design"', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {task}", actor=story.agent)
    story.expect_success(f"task unblock {task}", actor=story.agent)
    story.expect_rows(assignee_of(story, story.row(Task, task)) == worker.id, story.row(Task, task).holder_id is None,
                      len(story.story_rows(WorkerOperation)) == 0)


def test_a_new_worker_on_blocked_tasks_alone_is_made_and_not_started(idle_plan):
    story, _worker = idle_plan
    story.expect_success("worker dispatch --test-command python=pytest --fresh 'A second worker' --model sonnet 3", actor=story.agent)


def test_a_worker_given_a_plan_takes_a_later_phase_only_after_the_earlier_one(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    joined_person(story)
    repository_environment(story)
    story.expect_success('plan make "Two phases" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "First"', actor=story.user)
    story.expect_success('phase make --plan 1 "Second"', actor=story.user)
    second_phase_task = story.new_row_id('task make "Second phase work" --environment main', actor=story.agent)
    first_phase_task = story.new_row_id('task make "First phase work" --environment main', actor=story.agent)
    story.expect_success("phase place 1 --phase 1", actor=story.agent)
    story.expect_success(f"phase place {first_phase_task} --phase 1", actor=story.agent)
    story.expect_success(f"phase place {second_phase_task} --phase 2", actor=story.agent)
    ready_plan(story, actor=story.user)
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest --model sonnet --plan 1")
    next_task = story.container.get(WorkerNextTask).following(worker.id)
    story.expect_rows(next_task is not None and next_task.id == first_phase_task)


def test_an_open_task_given_to_an_ended_worker_with_a_blocked_task_is_sent_to_it(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda *_args: None)
    story.expect_success('task block 1 --reason "Waits on the design"', actor=worker)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    task = story.new_row_id('task make "Next work" --environment main', actor=story.agent)
    story.expect_success(f"task edit {task} --delegated-to {worker.id}", actor=story.agent)
    operation = story.container.get(Queries).query(WorkerOperation).newest().first()
    story.expect_rows(operation is not None and operation.line == f"worker send {agent_number(story, worker.id)} --task {task} --wait")
