from journal.engine.states.ended import Ended
from journal.engine.states.void import Void
from journal.features.reviewing.reviewing_nudges import ReviewingNudges
from journal.features.reviewing.states.reviewing import Reviewing
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import ORCHESTRATOR_MODE
from journal.models.worker_state import WorkerState
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.reviewer.reviewer_at_work import ReviewerAtWork


@story(ReviewerAtWork, mode=ORCHESTRATOR_MODE, subject=AgentRole.REVIEWER)
def test_a_report_that_passes_every_point_signs_the_work_off_and_ends_the_reviewer(story):
    result = story.agent_runs(story.agents.subject, "review record '1 passed. 2 passed.'")
    result.expect_command_passed()
    result.expect_agent_told(story.agents.main, WorkersNudges.IDLE_WORKER)
    story.expect_stack(story.agents.subject, Void, Reviewing, Ended)


@story(ReviewerAtWork, mode=ORCHESTRATOR_MODE, subject=AgentRole.REVIEWER)
def test_a_report_that_leaves_a_point_undecided_goes_to_the_agent_to_decide(story):
    result = story.agent_runs(story.agents.subject, "review record '1 passed. 2 undecided: the grammar file is missing.'")
    result.expect_command_passed()
    result.expect_agent_told(story.agents.main, ReviewingNudges.REVIEW_UNDECIDED)
    story.expect_stack(story.agents.subject, Void, Reviewing, Ended)


@story(ReviewerAtWork, mode=ORCHESTRATOR_MODE, subject=AgentRole.REVIEWER)
def test_only_the_reviewer_records_a_review(story):
    result = story.agent_runs(story.agents.main, "review record '1 passed. 2 passed.'")
    result.expect_command_refused()
    story.expect_stack(story.agents.subject, Void, Reviewing)


@story(ReviewerAtWork, mode=ORCHESTRATOR_MODE, subject=AgentRole.REVIEWER)
def test_a_report_with_a_short_point_sends_that_point_back_to_the_worker(story):
    story.worker_run_ends_with_its_session(story.agents.workers.first(), "the parser is done")
    result = story.agent_runs(story.agents.subject, "review record '1 passed. 2 short: the names of the rules are missing.'")
    result.expect_command_passed()
    story.expect_worker(story.agents.workers.first(), state=WorkerState.DISPATCHED)
    story.expect_stack(story.agents.subject, Void, Reviewing, Ended)
