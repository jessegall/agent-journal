from tests.stories.core.support.agent_labels import agent_number
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.agent_messages.worker_task_blocked_message import WorkerTaskBlockedMessage
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.core.modules.tasks.support.holder_assignee_check import assert_holders_are_assignees
from engine.testing.expectations.expect_reply import expect_reply_allowed
from engine.testing.expectations.expected_message import expected_agent_message
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


def test_a_worker_blocking_its_task_tells_the_main_agent_with_the_reason(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=worker)
    notice = WorkerTaskBlockedMessage.declared().agent_message(worker=agent_number(story, worker.id), task=1, reason="the build tool is missing").text
    story.expect_text(f"agent-line list --agent {story.agent.id}", notice)
    stop = story.hook(session, HookSamples.stop())
    expect_reply_allowed(stop)
    story.expect_text(f"agent-line list --agent {worker.id} --state waiting", notice)
    story.expect_text("task show 1", "state: blocked", "the build tool is missing")
    assert_holders_are_assignees(story)


def test_a_main_agent_blocking_a_task_gets_no_line(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=story.agent)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", expected_agent_message(WorkerTaskBlockedMessage.declared()))
    assert_holders_are_assignees(story)


def test_with_the_merger_on_a_task_a_worker_blocked_reaches_the_main_agent_at_once_in_one_line_and_not_through_the_merger(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=worker)
    lines = story.run(f"agent-line list --agent {story.agent.id}").output_text
    merger_lines = story.run("merger-line list --environment main", actor=story.agent).output_text
    story.expect_rows(lines.count(WorkerTaskBlockedMessage.declared().agent_message(worker=agent_number(story, worker.id), task=1).text) == 1, "blocked task" not in merger_lines, detail=lines + merger_lines)
