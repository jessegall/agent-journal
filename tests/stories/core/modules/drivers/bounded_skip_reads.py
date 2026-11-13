from datetime import timedelta


from tests.stories.core.modules.drivers.refusal_skips import REFUSED, SKIP, failed_run_story, full_line, guard_skips
from tests.stories.core.support.read_limit import limit_reads
from tests.stories.core.support.seeds.large_read_seeds import RefusedHookCallSeed

"""Book 3 of doc 1255, story 24: a refusal skip asks whether another rule refused since the last skip with one row,
however many refused calls lie between."""

DIFFERENT_RULE_REFUSALS = 207


def test_refusal_skip_with_207_refused_calls_of_another_rule_reads_one_row_and_resets_the_streak(new_story):
    story = failed_run_story(new_story)
    guard_skips(story, story.agent, 1)
    story.seed(RefusedHookCallSeed, DIFFERENT_RULE_REFUSALS, session_agent_id=story.agent.id)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.advance(timedelta(seconds=1))
    limit_reads(story)
    story.expect_text(SKIP, "held", actor=story.agent)
    story.expect_success("refusal-skip show 2", "streak: 1", actor=story.user)
