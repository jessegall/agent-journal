from core.modules.helpers.rules.start_names_model_rule import StartNamesModelRule
from suites.coding.modules.workers.policies.dispatch_names_model_policy import DispatchNamesModelPolicy


class DispatchNamesModelRule(StartNamesModelRule):
    """The old walk's answer for DispatchNamesModelPolicy, which owns it, until the walk is deleted."""

    name = DispatchNamesModelPolicy.key

    def __init__(self, policy: DispatchNamesModelPolicy) -> None:
        super().__init__(policy)
