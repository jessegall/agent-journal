from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.processes.rules.sleep_poll_rule import SleepPollRule


class SleepPollPolicy(RulePolicy):
    """The refusal of SleepPollRule, with today's text, as a policy of the new driver."""

    rule = SleepPollRule
    rank = "shell.all"
