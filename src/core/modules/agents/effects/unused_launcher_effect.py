from engine.rule_backed.rule_effect import RuleEffect
from core.modules.agents.rules.unused_launcher_rule import UnusedLauncherRule


class UnusedLauncherEffect(RuleEffect):
    """The commands for today's launcher of a main agent that no session uses, as today's UnusedLauncherRule runs them at the minute tick, run at the agent's
    minute step."""

    rule = UnusedLauncherRule
