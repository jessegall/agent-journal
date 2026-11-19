from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import ORCHESTRATOR_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.orchestrator_worker_delivered import OrchestratorWorkerDelivered


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
def test_finished_work_that_waited_ten_minutes_is_named_to_the_busy_orchestrator_on_its_tick(story):
    """On the hosted journal 12 to 15 finished workers waited on a busy orchestrator up to 15 hours (19 Nov): it heard of them
    only when it stopped, and it never stopped."""
    story.time_travel(minutes=11)
    result = story.agent_is_quiet_for(story.agents.subject, 1)
    result.expect_agent_told(story.agents.subject, WorkersNudges.FINISHED_WORK_WAITS)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
def test_work_that_finished_minutes_ago_is_not_named_yet(story):
    result = story.agent_is_quiet_for(story.agents.subject, 1)
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.FINISHED_WORK_WAITS)
    story.expect_stack(story.agents.subject, Orchestrating)
