from suites.coding.modules.workers.effects.orphan_worktree_effect import OrphanWorktreeEffect


def test_the_orphan_worktree_effect_runs_at_the_minute_step():
    assert OrphanWorktreeEffect.includes_steps
