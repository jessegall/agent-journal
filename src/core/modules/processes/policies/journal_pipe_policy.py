from engine.rule_backed.rule_policy import RulePolicy
from core.modules.processes.rules.journal_pipe_rule import JournalPipeRule


class JournalPipePolicy(RulePolicy):
    """The refusal of JournalPipeRule, with today's text, as a policy of the new driver."""

    rule = JournalPipeRule
    rank = "shell.all"
