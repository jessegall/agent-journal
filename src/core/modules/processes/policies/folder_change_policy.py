from engine.rule_backed.rule_policy import RulePolicy
from core.modules.processes.rules.folder_change_rule import FolderChangeRule


class FolderChangePolicy(RulePolicy):
    """The refusal of FolderChangeRule, with today's text, as a policy of the new driver."""

    rule = FolderChangeRule
    rank = "shell.all"
