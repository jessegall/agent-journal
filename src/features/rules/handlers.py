from events import Fact
from events.rules import RuleChanged, RuleCreated
from features.journal_laws.briefing import brief
from receiving import Handler
from resources.base import AGENT
from resources.types import Rule
from serving import Chat, ReadRows, Rows


class InjectRules(Handler[RuleChanged]):
    def handle(self, event: RuleChanged, rules: Rows[Rule]) -> list[Fact]:
        brief(rules.record.root.parent, rules.record)
        return []


class ReviewNewRule(Handler[RuleCreated]):
    def handle(self, event: RuleCreated, chat: Chat, rules: ReadRows[Rule]) -> list[Fact]:
        if event.actor != AGENT:
            return []
        chat.nudge("review", n=event.n, title=rules.load(event.n).title)
        return []
