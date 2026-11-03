from core.testing.hook_samples import HookSamples
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session


def test_a_worker_blocking_its_task_tells_the_main_agent_with_the_reason(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=worker)
    notice = WORKER_TASK_BLOCKED.nudge(worker=worker.id, task=1, reason="the build tool is missing").text
    story.expect_text(f"agent-line list --agent {story.agent.id}", notice)
    stop = story.hook(session, HookSamples.stop())
    assert stop.refusal == ""
    assert notice in stop.lines
    story.expect_text("task show 1", "state: blocked")


def test_a_main_agent_blocking_a_task_gets_no_line(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=story.agent)
    assert "blocked task:1" not in story.run(f"agent-line list --agent {story.agent.id}").output_text
