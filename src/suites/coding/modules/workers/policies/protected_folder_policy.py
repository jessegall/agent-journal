from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.protected_folder_rule import ProtectedFolderRule


class ProtectedFolderPolicy(RulePolicy):
    """The refusal of ProtectedFolderRule, with today's text, as a policy of the new driver."""

    rule = ProtectedFolderRule
    rank = "access.all"
