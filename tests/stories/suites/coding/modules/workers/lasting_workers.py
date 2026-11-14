from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
import json
from datetime import timedelta
from pathlib import Path

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.support.usage_lockdown import UsageLockdown
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.driver.program_lockdown import ProgramLockdown
from engine.enums.actor_type import ActorType
from engine.file.file_access import FileAccess
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker import EndInactiveWorker
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.modules.helpers import lifetime_reviewers
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.cold_workers import stopped_worker, with_job
from tests.stories.suites.coding.modules.workers.gone_workers import MAIN_SESSION, ended_worker, missing_program, running_worker
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, checked_worker, delivered_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.program_split import outage
from tests.stories.suites.coding.modules.workers.usage_lockdown_held_starts import launches
from tests.stories.support.program_states import real_program_states
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worker_settings import WORKER_KEPT_LIMIT

__all__ = ["ended_worker", "launches", "missing_program", "running_worker", "stopped_worker"]

KEPT_LIMIT = f"setting set {WORKER_KEPT_LIMIT} 1 --environment main"
MEMORY_TEXT = "The cart rounds each line before it adds them"
JOB = "Fix the rounding of the tax"
UNCOMMITTED_TEXT = "tax = 0.21\n"
LIMIT_WINDOW_SECONDS = 2 * 3600
COLD_IDLE_SECONDS = 90 * 60
TICKS = 3


@pytest.fixture
def worker_story(new_story):
    """A main agent with one open task in a repository, reading the real state of each program and its usage limit."""
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)
    repository_environment(story)
    real_program_states(story)
    story.rebuild(ProgramLockdown, UsageLockdown)
    return story


@pytest.fixture
def merged_worker(new_story):
    """A worker that made a memory and whose checked work was merged into the environment's branch."""
    story = new_story(fixture=OpenTaskOrchestrator)
    story.repository = repository_environment(story)
    story.worker = checked_worker(story, story.repository)
    story.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=story.worker)
    story.repository.checkout(ENVIRONMENT_BRANCH)
    request_merge(story, story.worker)
    story.expect_success(f"worker merge --wait {agent_number(story, story.worker.id)}", actor=story.agent)
    story.run_listeners()
    return story


def worker_rows(story) -> list[Agent]:
    return list(story.story_rows(Agent, role="worker"))


def worktree_rows(story, worker_id: int) -> list[Worktree]:
    return list(story.container.get(WorktreeQuery).worker_worktrees(worker_id))


def report_full_window(story) -> None:
    resets_at = story.clock.timestamp().value.timestamp() + LIMIT_WINDOW_SECONDS
    story.home.status_folder.mkdir(parents=True, exist_ok=True)
    report = {"session_id": MAIN_SESSION, "model": {"display_name": "Opus"}, "context_window": {"used_percentage": 10}, "rate_limits": {"five_hour": {"used_percentage": 100, "resets_at": resets_at}}}
    FileAccess.write(story.home.status_folder / f"{MAIN_SESSION}.json", json.dumps(report))


def test_a_dispatch_at_the_kept_limit_is_refused_naming_the_idle_worker_to_send_to_and_the_person_who_retires(merged_worker):
    story = merged_worker
    number = agent_number(story, story.worker.id)
    story.expect_success(KEPT_LIMIT)
    task_id = story.new_row_id('task make "Add the tax" --brief "Add the tax to the cart total"', actor=story.agent)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    outcome = story.run(DISPATCH.removesuffix(" 1") + f" {task_id}", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows(outcome.code == 1, "send the job to idle worker" in outcome.output_text, f"worker {number}" in outcome.output_text,
                      "ask the user to retire" in outcome.output_text, "journal agent retire" not in outcome.output_text, len(worker_rows(story)) == 1, detail=outcome.output_text)


def test_a_person_who_retires_a_worker_with_unmerged_work_is_refused(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    worker = delivered_worker(story, repository_environment(story))
    story.container.get(Bus).run(EndInactiveWorker(worker.id), story.agent)
    story.expect_refusal(f'agent retire {agent_number(story, worker.id)} --reason "Its task is done" --environment main', "unmerged work", actor=person)
    story.expect_rows(story.row(Agent, worker.id).retired_at is None)


def test_a_worker_at_its_usage_limit_keeps_the_limit_while_it_is_idle_and_starts_its_new_session_only_once_the_limit_ends(running_worker, launches):
    story = running_worker
    worker = story.row(Agent, story.worker.id)
    report_full_window(story)
    UsageLimitMarker()(story.container)
    limit_ends_at = story.row(Agent, worker.id).usage_limit_ends_at
    launches.clear()
    story.expect_success(f"agent end {worker.id}", actor=story.worker)
    story.run_listeners()
    story.advance(timedelta(seconds=COLD_IDLE_SECONDS))
    for _ in range(TICKS):
        WorkerResumeRetry()(story.container)
    limited = story.row(Agent, worker.id)
    story.expect_rows(limit_ends_at is not None, launches == [], limited.session == worker.session, limited.usage_limit_ends_at == limit_ends_at, detail=f"{len(launches)} launches, limit {limit_ends_at}")
    story.advance(timedelta(seconds=LIMIT_WINDOW_SECONDS - COLD_IDLE_SECONDS + 10))
    WorkerResumeRetry()(story.container)
    replaced = story.row(Agent, worker.id)
    story.expect_rows(len(launches) == 1, replaced.session != worker.session, replaced.number == worker.number, replaced.retired_at is None, len(worker_rows(story)) == 1, detail=str(launches))
    story.expect_rows(launches[0]["session"] == replaced.session, "--resume" not in launches[0]["command"])


def test_a_job_sent_to_a_worker_whose_program_is_out_waits_and_says_so_and_the_worker_keeps_its_session_until_the_program_is_back(stopped_worker, launches):
    story = stopped_worker
    worker = story.row(Agent, story.worker.id)
    outage(story, worker.program, 2 * COLD_IDLE_SECONDS // 60)
    story.expect_success(f"agent end {worker.id}", actor=story.user)
    story.run_listeners()
    story.advance(timedelta(seconds=COLD_IDLE_SECONDS))
    launches.clear()
    answer = story.run(f'worker send --wait {worker.number} "{JOB}"', actor=story.agent)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    waiting = story.row(Agent, worker.id)
    story.expect_rows(answer.code == 0, f"worker {worker.number} waits on {worker.program}" in answer.output_text, launches == [], waiting.session == worker.session,
                      waiting.retired_at is None, len(worker_rows(story)) == 1, detail=answer.output_text)
    story.expect_success(f"provider-outage end {worker.program}", actor=story.user)
    WorkerResumeRetry()(story.container)
    story.expect_rows(len(launches) == 1, launches[0]["agent_id"] == worker.id, JOB in " ".join(launches[0]["command"]), detail=str(launches))


def test_a_worker_whose_worktree_was_merged_stays_kept_and_idle_with_its_memories_and_its_session_ended(merged_worker):
    story = merged_worker
    worker = story.row(Agent, story.worker.id)
    story.expect_text("memory list", MEMORY_TEXT, actor=story.worker)
    story.expect_text(f"worker status {worker.number}", f"worker {worker.number} is idle", "no worktree", actor=story.agent)
    story.expect_text(f"agent show {worker.number} --environment main", f"number: {worker.number}", "role: worker", actor=story.agent)
    story.expect_rows(worker.retired_at is None, worker.ended_at is not None, story.container.get(WorktreeQuery).worker_worktree(worker.id) is None, len(worker_rows(story)) == 1)


def test_a_job_sent_to_a_merged_worker_cuts_a_second_worktree_from_the_current_branch_and_its_status_shows_it(merged_worker):
    story = merged_worker
    worker = story.row(Agent, story.worker.id)
    story.repository.committed("tax.py", UNCOMMITTED_TEXT, "Add the tax rate")
    lifetime_reviewers.launches(story, f'worker send --wait {worker.number} "{JOB}"')
    first, second = worktree_rows(story, worker.id)
    story.expect_rows(second.base_commit == story.repository.tip(ENVIRONMENT_BRANCH), second.base_branch == ENVIRONMENT_BRANCH, second.branch == f"{first.branch}-2",
                      second.folder == first.folder, len(worker_rows(story)) == 1, detail=f"{first.branch} / {second.branch} / {second.base_commit}")
    story.expect_text(f"worker status {worker.number}", second.branch, JOB, actor=story.agent)


def test_a_cold_worker_with_an_open_worktree_starts_its_new_session_in_the_same_folder_and_branch_and_its_uncommitted_file_stays(stopped_worker):
    story = stopped_worker
    opened = story.container.get(WorktreeQuery).worker_worktree(story.worker.id)
    uncommitted_file = Path(opened.folder) / "tax.py"
    uncommitted_file.write_text(UNCOMMITTED_TEXT)
    worker, request = with_job(story, COLD_IDLE_SECONDS // 60, 20)
    current = story.container.get(WorktreeQuery).worker_worktree(worker.id)
    story.expect_rows(story.row(Agent, worker.id).session != worker.session, request["folder"] == opened.folder, current.id == opened.id, current.folder == opened.folder,
                      current.branch == opened.branch, uncommitted_file.read_text() == UNCOMMITTED_TEXT, len(worktree_rows(story, worker.id)) == 1, detail=str(request))
