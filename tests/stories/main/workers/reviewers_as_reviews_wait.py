from journal.features.reviewing.reviewing_options import ReviewingOptions
from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_options import ORCHESTRATOR_MODE, WorkersOptions
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.main.orchestrator_two_workers import OrchestratorTwoWorkers

ONE_REVIEWER, TWO_REVIEWERS = 1, 2


@story(OrchestratorTwoWorkers, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(ReviewingOptions.REVIEWER, True)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.REVIEWER_LIMIT, TWO_REVIEWERS)
def test_with_the_journal_dispatching_a_second_review_waiting_gets_a_second_reviewer(story):
    clock_out_both(story)
    story.expect_row_count("reviewers", TWO_REVIEWERS)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorTwoWorkers, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(ReviewingOptions.REVIEWER, True)
def test_with_the_journal_dispatching_off_a_second_review_waits_for_the_one_reviewer(story):
    clock_out_both(story)
    story.expect_row_count("reviewers", ONE_REVIEWER)
    story.expect_stack(story.agents.subject, Orchestrating)


def clock_out_both(story) -> None:
    story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
    story.agent_proves(story.agents.workers.first(), 2, "parser.py:30, test_names passes")
    story.agent_clocks_out(story.agents.workers.first(), "the parser is done")
    story.agent_proves(story.agents.workers.second(), 1, "printer.py:8, test_prints passes")
    story.agent_clocks_out(story.agents.workers.second(), "the printer is done")
    story.expect_task(story.tasks.peer, delegated=True)
