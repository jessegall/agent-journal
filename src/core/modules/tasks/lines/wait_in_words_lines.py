from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.tasks.rules.wait_description_rule import WaitDescriptionRule


class WaitInWordsLines(RuleLineSource):
    """The lines of a wait put in words, in today's words of WaitDescriptionRule."""

    rule = WaitDescriptionRule
