from tests.stories.core.support.agent_labels import agent_number
import pytest
from engine.provider.context_window import ContextWindow
from core.modules.messages.commands.read_message.read_message import ReadMessage
from engine.driver.nudger import Nudger
from engine.command.context import Context
from core.modules.tasks.models.task import Task
from engine.testing.examples.hook_samples import HookSamples
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from datetime import timedelta
from pathlib import Path

from unittest.mock import patch

from engine.command.bus import Bus
from engine.database.database import Database
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker import EndInactiveWorker
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, delivered_worker, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.worktree_samples import worktree_commit
from tests.stories.core.support.plan_steps import state_tasks_wait_on_nothing
from tests.stories.core.support.agent_labels import agent_label

REASON = '--reason "Its work is finished"'


def stopped(story, worker) -> None:
    story.container.get(Bus).run(EndInactiveWorker(worker.id), story.agent)


def test_a_worker_with_unmerged_work_is_not_retired(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    stopped(story, worker)
    story.expect_refusal(f"agent retire {agent_number(story, worker.id)} {REASON}", "unmerged work", actor=story.agent)


def test_retire_settles_what_a_worker_holds(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    general = story.run(f"worker send --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(general.code == 1)
    stopped(story, worker)
    story.expect_success(f"agent retire {agent_number(story, worker.id)} {REASON}", f"retired {agent_label(story, worker.id)}", actor=story.agent)
    story.expect_success("worker-worktree show 1", "state: removed")
    story.expect_success("task show 1", "state: open")
    repository.expect_no_folder(worker.id)
    retired = story.run(f'worker send --wait {agent_number(story, worker.id)} "Another job"', actor=story.agent)
    story.expect_rows(retired.code == 5, "retired" in retired.output_text)


@pytest.mark.real_git
def test_a_retire_runs_git_outside_the_transaction(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    stopped(story, worker)
    database = story.container.get(Database)
    git = WorktreeGit.git
    internal = []

    def recording_git(self, *arguments, **options):
        if "status" in arguments or "rev-parse" in arguments:
            internal.append(database.has_transaction)
        return git(self, *arguments, **options)
    with patch.object(WorktreeGit, "git", recording_git):
        story.expect_success(f"agent retire {agent_number(story, worker.id)} {REASON}", actor=story.agent)
    story.expect_rows(bool(internal), not any(internal))


def test_at_the_kept_maximum_a_dispatch_is_refused_with_a_retire_line(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success("setting set journal.suites.coding.workers.worker-kept-limit 1 --environment main", actor=story.user)
    worker = dispatched_worker(story)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_refusal(f"worker dispatch --test-command python=pytest --model sonnet {task_id}", f"the limit of 1 workers is reached: agent:{agent_number(story, worker.id)}", actor=story.agent)


def test_a_worker_resume_at_the_run_limit_is_held_and_starts_when_a_place_frees(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started\n", request_count=3)
    worker = delivered_worker(story, repository)
    story.run_listeners()
    stopped(story, worker)
    story.run_listeners()
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 0 --environment main", actor=story.user)
    story.advance(timedelta(seconds=1))
    story.expect_success(f'worker send --wait {agent_number(story, worker.id)} "Add the tax"', actor=story.agent)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    limit_start_count = len(launcher.starts)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 2 --environment main", actor=story.user)
    WorkerResumeRetry()(story.container)
    story.expect_rows(limit_start_count == 1, len(launcher.starts) == 2)


def test_a_task_sent_to_a_delivered_worker_waits_and_the_delivery_stays_mergeable(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", actor=story.agent)
    story.expect_text(f"task show {task_id}", "state: open", f"delegated_to: {worker.id}", actor=story.agent)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("worker-worktree list", "delivered", actor=story.agent)
    story.expect_text("proof list --task 1", "cart.py:1", actor=story.agent)


def test_the_merge_of_a_delivered_worker_starts_the_task_sent_while_it_waited(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    story.expect_text(f"task show {task_id}", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.id)
    story.expect_rows(worktree.task_id == task_id, Path(worktree.folder).is_dir())


def test_a_merged_worker_gets_a_new_cut_on_its_session(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", actor=story.agent)
    story.expect_text(f"task show {task_id}", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.id)
    newest = story.container.get(WorktreeQuery).newest_worktree(worker.id)
    story.expect_rows(worktree.task_id == task_id, newest.id == worktree.id, Path(worktree.folder).is_dir())


def test_an_unmerged_branch_is_never_overwritten(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(f'worker release {agent_number(story, worker.id)} "Not needed"', actor=story.agent)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_refusal(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", "unmerged work", actor=story.agent)


def test_a_dispatch_with_an_idle_worker_is_refused_with_its_send_line_and_fresh_passes(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    monkeypatch.setattr(ClaudeCodeProvider, "session_matches_folder", lambda provider, folder, session: True)
    stopped(story, worker)
    second, third = (story.new_row_id(f'task make "Task {number}"', actor=story.agent) for number in (2, 3))
    story.expect_refusal(f"worker dispatch --test-command python=pytest --model sonnet {second} {third}", f"journal worker send {agent_number(story, worker.id)} --task {second} {third}", actor=story.agent)
    new_worker = dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet --fresh 'Another model of thinking' {second} {third}")
    worktree = story.container.get(WorktreeQuery).worker_worktree(new_worker.id)
    story.expect_rows(worktree.new_agent_reason == "Another model of thinking")



def test_a_worker_whose_task_was_cancelled_can_be_released(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task cancel 1 --reason "Not needed"', actor=story.user)
    story.expect_success(f'worker release {agent_number(story, worker.id)} "Its task was cancelled"', actor=story.agent)
    story.expect_rows(story.container.get(WorktreeQuery).worker_worktree(worker.id) is None)


def merged_kept_worker(story, repository):
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    return worker


def test_a_send_with_an_open_dependency_assigns_the_task_to_wait_and_cuts_no_worktree(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = merged_kept_worker(story, repository_environment(story))
    first, second = (story.new_row_id(f'task make "Task {number}"', actor=story.agent) for number in (2, 3))
    story.expect_success(f"task depend {second} --on {first}", actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {second}", actor=story.agent)
    story.expect_rows(story.container.get(WorktreeQuery).worker_worktree(worker.id) is None, story.row(Task, second).delegated_to == worker.id)


@pytest.mark.real_git
def test_a_failed_cut_leaves_no_worktree_and_the_real_error(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = merged_kept_worker(story, repository_environment(story))
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)

    def refused_cut(git, folder, worktree, start):
        raise Refusal("the cut failed")

    monkeypatch.setattr(WorktreeGit, "cut", refused_cut)
    story.expect_refusal(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", "the cut failed", actor=story.agent)
    story.expect_rows(story.container.get(WorktreeQuery).worker_worktree(worker.id) is None)


def test_a_send_while_tests_run_is_refused_and_nothing_moves(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = delivered_worker(story, repository_environment(story))
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    monkeypatch.setattr(WorkerProofQueue, "tests_pending", lambda queue, worktree: True)
    story.expect_refusal(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", "are running", actor=story.agent)
    story.expect_text(f"task show {task_id}", "state: open", actor=story.agent)


def test_a_nearly_full_worker_is_not_offered(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = merged_kept_worker(story, repository_environment(story))
    monkeypatch.setattr(ClaudeCodeProvider, "session_matches_folder", lambda provider, folder, session: True)
    monkeypatch.setattr(ClaudeCodeProvider, "context_window", lambda provider, home, session: ContextWindow(80, None))
    stopped(story, worker)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet {task_id}")


def test_an_approved_plan_does_not_hold_a_stop_when_no_new_worker_can_start(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success("setting set journal.suites.coding.workers.worker-kept-limit 1 --environment main", actor=story.user)
    dispatched_worker(story)
    plan_id = story.new_row_id('plan make "A plan" --brief "A goal"', actor=story.agent)
    phase_id = story.new_row_id(f'phase make --plan {plan_id} "One" --goal "It is done"', actor=story.agent)
    story.expect_success(f'task make "First" --phase {phase_id}', actor=story.agent)
    story.expect_success(f'task make "Second" --phase {phase_id}', actor=story.agent)
    state_tasks_wait_on_nothing(story, story.agent, plan_id)
    story.expect_success(f"plan ready {plan_id}", actor=story.agent)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"plan approve {plan_id} --environment main", actor=person)
    story.expect_hook_allowed("s-1", HookSamples.sample("stop"))



def test_a_plain_job_after_merge_starts_a_task_and_keeps_the_worktree_links(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.library("node_modules", "index.js", "module.exports = 1\n")
    worker = checked_worker(story, repository, "worker dispatch --test-command python=pytest --model sonnet 1 --library-link node_modules")
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    session = worker_session(story, worker)
    story.expect_success(f'worker send --wait {agent_number(story, worker.id)} "Fix the findings"', actor=story.agent)
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.id)
    story.expect_text(f"task show {worktree.task_id}", "Fix the findings", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "Fix the findings", actor=worker)
    story.expect_rows(worker_session(story, worker) == session)
    repository.expect_link(worker.id, "node_modules")


def test_retire_hides_the_lines_still_waiting_for_the_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    stopped(story, worker)
    with story.container.get(Database).transaction():
        story.container.get(Nudger).send_text(worker.id, "A line the worker never took", "sample.raw", Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))
    story.expect_text(f"agent-line list --agent {worker.id} --json", '"state": "waiting"', actor=story.user)
    story.expect_success(f"agent retire {agent_number(story, worker.id)} {REASON}", f"retired {agent_label(story, worker.id)}", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id} --json", '"state": "hidden"', actor=story.user)
