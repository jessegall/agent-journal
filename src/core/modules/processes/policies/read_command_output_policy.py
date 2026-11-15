from engine.rule_backed.rule_policy import RulePolicy
from core.modules.processes.rules.read_command_output_rule import ReadCommandOutputRule


class ReadCommandOutputPolicy(RulePolicy):
    """The refusal of ReadCommandOutputRule, with today's text, as a policy of the new driver."""

    rule = ReadCommandOutputRule
    rank = "shell.all"
