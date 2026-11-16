from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from tests.stories.core.modules.plans.plan_building_sequence import StandardSequences

REPORT_HANDLING = "Handling a helper's report"


def report_handling_runs(story) -> list[SequenceRun]:
    sequence = next(row for row in story.story_rows(Sequence) if row.title == REPORT_HANDLING)
    return [run for run in story.story_rows(SequenceRun) if run.sequence_id == sequence.id]


def test_a_helpers_report_starts_the_report_sequence_for_the_main_agent_which_ends_only_after_a_comment_on_it(new_story):
    story = new_story(fixture=StandardSequences)
    helper = story.agent_actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id} --environment main"))
    story.expect_success('report make "Cart trace" --abstract "Where the total goes wrong" --body "The total rounds twice." --environment main', actor=helper)
    story.run_listeners()
    runs = report_handling_runs(story)
    story.expect_rows(len(runs) == 1, runs[0].session_agent_id == story.agent.id if runs else False, detail=str(runs))
    for _ in range(2):
        story.expect_success("sequence follow", actor=story.agent)
        story.expect_success("sequence next", actor=story.agent)
    story.expect_success("sequence follow", actor=story.agent)
    story.expect_refusal("sequence next", "has no comment on what came of it", actor=story.agent)
    story.expect_success('report comment 1 "Fixed the double rounding in task 3"', actor=story.agent)
    story.expect_success("sequence next", actor=story.agent)


def test_the_main_agents_own_report_starts_no_report_sequence(new_story):
    story = new_story(fixture=StandardSequences)
    story.expect_success('report make "My check" --abstract "A check" --body "All fine." --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_rows(not report_handling_runs(story))
