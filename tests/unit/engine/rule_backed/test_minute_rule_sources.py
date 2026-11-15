from core.modules.waits.lines.long_wait_lines import LongWaitLines
from suites.coding.modules.workers.effects.orphan_worktree_effect import OrphanWorktreeEffect


def test_a_rule_that_keeps_time_is_asked_at_the_minute_step():
    assert LongWaitLines.includes_steps and OrphanWorktreeEffect.includes_steps
