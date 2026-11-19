from journal.engine.states.void import Void
from journal.features.reviewing.states.reviewing import Reviewing
from journal.features.workers.workers_options import ORCHESTRATOR_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.reviewer.reviewer_at_work import ReviewerAtWork


@story(ReviewerAtWork, mode=ORCHESTRATOR_MODE, subject=AgentRole.REVIEWER)
def test_a_reviewer_is_handed_the_test_run_the_journal_made_at_the_clock_out_so_it_needs_no_run_of_its_own(story):
    story.expect_reviewer_brief_holding(story.agents.subject, "the journal ran: ./run_tests.sh parser_story.py (passed)")
    story.expect_reviewer_brief_holding(story.agents.subject, "run no test yourself, and leave no point undecided for want of one")
    story.expect_stack(story.agents.subject, Void, Reviewing)
