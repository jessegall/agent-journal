from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.secrets.rules.secrets_folder_rule import SecretsFolderRule


class SecretsFolderPolicy(RulePolicy):
    """The refusal of SecretsFolderRule, with today's text, as a policy of the new driver."""

    rule = SecretsFolderRule
    rank = "safety.all"
    is_safety = True
    grant_types = []
