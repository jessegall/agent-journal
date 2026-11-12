from datetime import timedelta

from core.modules.processes.models.process import Process
from tests.stories.core.modules.drivers.refusal_skips import REFUSED, SKIP, TRIED, failed_run_story, full_line
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.core.support.read_limit import limit_reads
from tests.stories.core.support.seeds.large_read_seeds import RefusedHookCallSeed

"""Book 3 of doc 1255, story 24: a refusal skip asks whether another rule refused since the last skip with one row,
however many refused calls lie between."""

OTHER_RULE_REFUSALS = 207


def test_refusal_skip_with_207_refused_calls_of_another_rule_reads_one_row_and_resets_the_streak(new_story):
    story = failed_run_story(new_story)
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.advance(timedelta(seconds=1))
    story.expect_text(SKIP, "held", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.expect_success(f'refusal confirm 1 --tried "{TRIED}" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", full_line())
    end_run(story, story.row(Process, 2), "1 failed\n", exit_code=1)
    story.advance(timedelta(seconds=1))
    story.seed(RefusedHookCallSeed, OTHER_RULE_REFUSALS, session_agent_id=story.agent.id)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", full_line(), REFUSED)
    story.advance(timedelta(seconds=1))
    limit_reads(story)
    story.expect_success(SKIP, actor=story.agent)
    story.expect_success("refusal-skip show 2", "streak: 1", actor=story.user)
