from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.processes.rules.journal_chain_rule import JournalChainRule


class JournalChainPolicy(RulePolicy):
    """The refusal of JournalChainRule, with today's text, as a policy of the new driver."""

    rule = JournalChainRule
    rank = "shell.all"
