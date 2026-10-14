from events import Fact
from events.rules import RuleChanged, RulesToInject
from receiving import Listener


class SpotRuleChange(Listener[RuleChanged]):
    def listen(self, event: RuleChanged) -> list[Fact]:
        return [RulesToInject()]
