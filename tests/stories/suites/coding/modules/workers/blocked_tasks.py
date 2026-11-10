from tests.stories.core.support.agent_labels import agent_number
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_line


def test_a_worker_blocking_its_task_tells_the_main_agent_with_the_reason(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=worker)
    notice = WORKER_TASK_BLOCKED.nudge(worker=agent_number(story, worker.id), task=1, reason="the build tool is missing").text
    story.expect_text(f"agent-line list --agent {story.agent.id}", notice)
    stop = story.hook(session, HookSamples.stop())
    expect_reply_allowed(stop)
    expect_reply_line(stop, notice)
    story.expect_text("task show 1", "state: blocked", "the build tool is missing")


def test_a_main_agent_blocking_a_task_gets_no_line(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=story.agent)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "blocked task:1")
