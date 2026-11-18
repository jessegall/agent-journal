from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_nudges import WorkersNudges
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.models.worker_state import WorkerState
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.worker.plan_worker import PlanWorker
from tests.stories.fixtures.worker.worker_delivered import WorkerDelivered
from tests.stories.fixtures.worker.working_worker import WorkingWorker


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_the_user_cancelling_a_workers_task_leaves_it_cancelled_and_undelegated(story):
    story.user_cancels_task(story.tasks.briefed, "not needed")
    story.expect_task(story.tasks.briefed, state=TaskState.CANCELLED)
    story.expect_worker(story.agents.workers.first(), state=WorkerState.RELEASED)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_the_user_blocking_a_workers_task_takes_it_from_the_worker(story):
    story.user_blocks_task(story.tasks.briefed, "later")
    story.expect_task(story.tasks.briefed, state=TaskState.BLOCKED)
    story.expect_worker(story.agents.workers.first(), state=WorkerState.RELEASED)
    story.expect_stack(story.agents.subject, Ready)


@story(PlanWorker, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_releasing_a_worker_still_out_waits_for_its_stop_and_then_opens_its_queue(story):
    result = story.agent_runs(story.agents.subject, f"worker release {story.agents.workers.first()}")
    result.expect_command_refused()
    story.agent_runs(story.agents.subject, f"worker stop {story.agents.workers.first()}")
    result = story.agent_runs(story.agents.subject, f"worker release {story.agents.workers.first()}")
    result.expect_command_passed()
    story.expect_task(story.tasks.second, state=TaskState.OPEN, delegated=False)
    story.expect_worker(story.agents.workers.first(), state=WorkerState.RELEASED)
    story.expect_stack(story.agents.subject, Ready)


@story(PlanWorker, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_plan_handed_whole_to_a_worker_that_is_released_comes_back_paused_to_the_agent(story):
    story.agent_runs(story.agents.subject, f"worker stop {story.agents.workers.first()}")
    story.agent_runs(story.agents.subject, f"worker release {story.agents.workers.first()}")
    story.expect_plan(story.plans.first, state=PlanState.PAUSED)
    story.expect_task(story.tasks.first, delegated=False)
    story.expect_task(story.tasks.second, delegated=False)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkerDelivered, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_task_the_user_cancels_while_its_work_waits_releases_the_worker_unmerged(story):
    story.user_cancels_task(story.tasks.briefed, "not needed")
    story.expect_worker(story.agents.workers.first(), state=WorkerState.RELEASED)
    story.expect_task(story.tasks.briefed, state=TaskState.CANCELLED)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_stopping_a_worker_tells_the_agent_it_ended_without_a_report(story):
    result = story.agent_runs(story.agents.subject, f"worker stop {story.agents.workers.first()}")
    result.expect_command_passed()
    story.expect_worker(story.agents.workers.first(), state=WorkerState.STOPPED)
    result.expect_agent_told(story.agents.subject, WorkersNudges.WORKER_STOPPED_UNREPORTED)
    story.expect_stack(story.agents.subject, Ready)
