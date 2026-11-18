from journal.features.workers.workers_nudges import WorkersNudges
from journal.engine.states.void import Void
from journal.features.workers.states.working_task import WorkingTask
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.worker.working_worker import WorkingWorker


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
def test_a_workers_stop_hears_nothing_of_a_plan_the_user_approved_for_the_main_agent(story):
    plan = story.user_creates_plan("release", "ship it")
    story.user_adds_plan_task(plan, "write the notes")
    story.user_approves_plan(plan)
    result = story.agent_stops(story.agents.subject)
    result.expect_agent_told(story.agents.subject, WorkersNudges.CLOCK_OUT_DUE)
    story.expect_task(story.tasks.briefed, delegated=True)
    story.expect_stack(story.agents.subject, Void, WorkingTask)
