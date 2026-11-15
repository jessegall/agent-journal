from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.workers.rules.orphan_worktree_rule import OrphanWorktreeRule


class OrphanWorktreeEffect(RuleEffect):
    """The commands for a worktree no worker holds, as today's OrphanWorktreeRule runs them at the minute tick, run at the agent's
    minute step."""

    rule = OrphanWorktreeRule
