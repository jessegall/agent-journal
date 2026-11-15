from engine.rule_backed.rule_policy import RulePolicy
from core.modules.drivers.rules.private_corpus_rule import PrivateCorpusRule


class PrivateCorpusPolicy(RulePolicy):
    """The refusal of PrivateCorpusRule, with today's text, as a policy of the new driver."""

    rule = PrivateCorpusRule
    rank = "safety.all"
    is_safety = True
    grant_types = []
