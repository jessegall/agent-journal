from events import Fact
from events.journal_laws import LargerResult, LawMentioned, LongReadRefused
from events.rules import RulesToInject
from features.journal_laws.briefing import brief
from features.journal_laws.details import LARGEST_RESULT
from features.journal_laws.listeners import largest_key
from framework.recital import WHISPERED_LAW
from receiving import Handler
from resources.types import AgentRow, Rule
from serving import Chat, Remembered, Rows


class RepeatTheLaw(Handler[LawMentioned]):
    def handle(self, event: LawMentioned, chat: Chat) -> list[Fact]:
        chat.remind(WHISPERED_LAW, type="law", n=event.law, title=event.text)
        return []


class MarkTheRefusedRead(Handler[LongReadRefused]):
    def handle(self, event: LongReadRefused, agents: Rows[AgentRow]) -> list[Fact]:
        agents.card(event.agent, label=f"Refused reading a long file whole `{event.path}`", icon="terminal", tone="danger",
                    title=f"{event.count:,} lines; told to {event.instead} or grep instead")
        return []


class NameTheLargestResult(Handler[LargerResult]):
    def handle(self, event: LargerResult, chat: Chat, remembered: Remembered) -> list[Fact]:
        remembered.set(largest_key(event.agent), event.size)
        chat.nudge(LARGEST_RESULT, tool=event.tool or "that tool", size=f"{event.size:,}")
        return []


class InjectRules(Handler[RulesToInject]):
    def handle(self, event: RulesToInject, rules: Rows[Rule]) -> list[Fact]:
        brief(rules.record.root.parent, rules.record)
        return []
