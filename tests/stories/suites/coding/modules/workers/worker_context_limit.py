import json

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.journal_home import LAUNCHER_SOCKET
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, dispatched_worker, repository_environment, worker_session

LIMIT = 400_000
JOB = "Add the tax as well"


def limit_enabled(story):
    story.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=story.user)
    story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {LIMIT} --project", actor=story.user)


def has_context(story, worker, tokens):
    save_status_file(story, worker_session(story, worker), {"context_window": {"total_input_tokens": tokens}})


def launched(launcher, number):
    return json.dumps(launcher.requests[number]["command"])


@pytest.fixture
def ended_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = checked_worker(story, repository_environment(story))
    limit_enabled(story)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    return story, worker


@pytest.fixture
def compacting_worker(ended_worker):
    story, worker = ended_worker
    has_context(story, worker, LIMIT)
    launcher = with_job(story, worker)
    launcher.drain_requests()
    return story, worker, launcher


def with_job(story, worker):
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET))
    story.run(f'worker send --wait {worker.id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    return launcher


def compaction_ended(story, worker, launcher, tokens):
    launcher.server.close()
    story.home.socket(LAUNCHER_SOCKET).unlink()
    has_context(story, worker, tokens)
    following = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET))
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    following.drain_requests()
    return launched(following, 0)


def test_a_worker_past_the_limit_compacts_its_session_before_its_job_runs(compacting_worker):
    story, worker, launcher = compacting_worker
    command = launched(launcher, 0)
    story.expect_rows(COMPACT_LINE.split()[0] in command, "--resume" in command, JOB not in command, detail=command)


def test_a_worker_under_the_limit_resumes_on_its_job(ended_worker):
    story, worker = ended_worker
    has_context(story, worker, LIMIT - 1)
    launcher = with_job(story, worker)
    launcher.drain_requests()
    command = launched(launcher, 0)
    story.expect_rows("/compact" not in command, JOB in command, detail=command)


def finished_task_ids(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    story.expect_success("task overview 1", actor=worker)
    repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, by reading"', actor=worker)
    return story, worker


def test_a_worker_past_the_limit_at_worker_next_is_told_to_stop_and_may_stop_with_its_next_task_started(new_story):
    story, worker = finished_task_ids(new_story)
    limit_enabled(story)
    has_context(story, worker, LIMIT)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.expect_text("task show 2", "state: started", actor=story.agent)
    session = worker_session(story, worker)
    story.expect_hook_allowed(session, HookSamples.sample("post_tool_use"), "stop now")
    story.expect_success('memory skip "nothing to keep"', actor=worker)
    story.expect_hook_allowed(session, HookSamples.stop())


def test_a_worker_under_the_limit_at_worker_next_goes_on_and_may_not_stop(new_story):
    story, worker = finished_task_ids(new_story)
    limit_enabled(story)
    has_context(story, worker, LIMIT - 1)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.expect_hook_refusal(worker_session(story, worker), HookSamples.stop(), "task")
