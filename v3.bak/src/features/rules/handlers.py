from events import Fact
from events.rules import RuleCreated
from receiving import Handler
from resources.base import AGENT
from resources.types import Rule
from serving import Chat, ReadRows


class ReviewNewRule(Handler[RuleCreated]):
    def handle(self, event: RuleCreated, chat: Chat, rules: ReadRows[Rule]) -> list[Fact]:
        if event.actor != AGENT:
            return []
        chat.nudge("review", n=event.n, title=rules.load(event.n).title)
        return []
