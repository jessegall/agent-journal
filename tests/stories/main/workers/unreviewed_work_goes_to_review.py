from journal.features.reviewing.jobs.review_backlog import ReviewBacklog
from journal.features.reviewing.reviewing_options import ReviewingOptions
from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_options import ORCHESTRATOR_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.main.orchestrator_worker_delivered import OrchestratorWorkerDelivered

NO_REVIEWER, ONE_REVIEWER = 0, 1


def journal_queues_unreviewed_work(story) -> None:
    from journal.engine.clock import Clock
    story.app.container.get(ReviewBacklog).tick(story.app.container.get(Clock).held_at)
    story.app.runtime().deferred.drain()


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(ReviewingOptions.REVIEWER, True)
def test_work_that_clocked_out_without_a_review_and_waited_ten_minutes_goes_to_a_reviewer(story):
    """On the hosted journal 17 workers that clocked out with no review waited 7 to 17 hours on the agent (19 Nov)."""
    story.expect_worker(story.agents.workers.first(), review_pending=False)
    story.time_travel(seconds=601)
    journal_queues_unreviewed_work(story)
    story.expect_worker(story.agents.workers.first(), review_pending=True)
    story.expect_row_count("reviewers", ONE_REVIEWER)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(ReviewingOptions.REVIEWER, True)
def test_work_that_clocked_out_minutes_ago_is_left_to_the_agent_for_now(story):
    journal_queues_unreviewed_work(story)
    story.expect_worker(story.agents.workers.first(), review_pending=False)
    story.expect_row_count("reviewers", NO_REVIEWER)
    story.expect_stack(story.agents.subject, Orchestrating)
