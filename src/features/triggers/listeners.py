from itertools import takewhile

from events import Fact
from events.agents import AgentMessageSent, AgentReported, ClockTicked, ToolCallAnswered
from events.messages import MessageCreated
from events.triggers import ChatWordDenied, TriggerHolding, TriggerReleased, TriggerMet, TriggerShowing
from features.triggers.watching import REMINDING, WATCHING, firing
from framework.recital import COMMANDS, answered_words
from framework.watched import filled
from payload import HookEvent
from declaring.trigger import MINUTE
from receiving import Listener
from resources.base import USER
from resources.triggers import DENY, HOLD, INSTRUCT, NUDGE, Trigger
from resources.types import AgentRow, Message
from serving import Clock, ReadOwnWork, ReadRemembered, ReadRows, Settings

CHAT_DENIED = "caught a denied word in the agent's message"


def sent_key(trigger: int, key: str) -> str:
    return f"sent|{trigger}:{key}"


def showing(triggers: ReadRows[Trigger], agents: ReadRows[AgentRow], work: ReadOwnWork, remembered: ReadRemembered, settings: Settings, now: float) -> list[Fact]:
    """What the state triggers that nudge or instruct see now, for the agent the chat is with: once each unless a trigger times them, and at most as often as it says."""
    agent = agents.primary_to_read()
    if agent is None or not settings.is_on(REMINDING):
        return []
    facts = []
    for row in triggers.rows.standing():
        if not row.is_state or row.does not in (NUDGE, INSTRUCT):
            continue
        for found in work.watching(row.n, agent.n):
            if row.most and remembered.get(sent_key(row.n, found.key), 0) >= int(row.most):
                continue
            fact = TriggerShowing(agent=agent.n, row=row.n, does=str(row.does), key=found.key,
                                  values=tuple(sorted({**found.values, "title": row.title, "text": filled(row.wording, found.values)}.items())))
            facts.append(fact.every(f"{row.n}:{found.key}", float(row.timing) * MINUTE, now) if row.timing else fact.once(f"{row.n}:{found.key}"))
    return facts


class SpotWhatTheJournalShowsOnTheClock(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, triggers: ReadRows[Trigger], agents: ReadRows[AgentRow], work: ReadOwnWork, remembered: ReadRemembered, settings: Settings,
               clock: Clock) -> list[Fact]:
        return showing(triggers, agents, work, remembered, settings, clock.now())


class SpotWhatTheJournalShowsOnToolUse(Listener[AgentReported]):
    def listen(self, event: AgentReported, triggers: ReadRows[Trigger], agents: ReadRows[AgentRow], work: ReadOwnWork, remembered: ReadRemembered,
               settings: Settings, clock: Clock) -> list[Fact]:
        if event.hook == HookEvent.POST_TOOL_USE:
            return []
        return showing(triggers, agents, work, remembered, settings, clock.now())


class SpotWhatHoldsTheAgent(Listener[AgentReported]):
    def listen(self, event: AgentReported, triggers: ReadRows[Trigger], work: ReadOwnWork, settings: Settings) -> list[Fact]:
        if not settings.is_on(REMINDING):
            return []
        facts = []
        for row in triggers.rows.standing():
            if not row.is_state or row.does != HOLD:
                continue
            found = work.watching(row.n, event.agent)
            facts.append(TriggerHolding(agent=event.agent, row=row.n, title=row.title, text=filled(row.wording, found[0].values)) if found
                         else TriggerReleased(agent=event.agent, row=row.n))
        return facts


class SpotWhatTheUserWrites(Listener[MessageCreated]):
    def listen(self, event: MessageCreated, triggers: ReadRows[Trigger], messages: ReadRows[Message], agents: ReadRows[AgentRow], settings: Settings) -> list[Fact]:
        agent = agents.primary_to_read()
        message = messages.peek(event.n)
        if event.actor != USER or not settings.is_on(WATCHING) or agent is None or message.data.get("trigger"):
            return []
        text = f"{message.title} {message.brief}"
        return [TriggerMet(agent=agent.n, row=row.n, about=f"message:{message.n}")
                for row in firing(triggers, lambda scope: "" if scope == COMMANDS else text, from_user=True) if row.does != DENY]


class SpotWhatTheAgentWrites(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent, triggers: ReadRows[Trigger], settings: Settings) -> list[Fact]:
        if not settings.is_on(WATCHING):
            return []
        facts = []
        for row in firing(triggers, lambda scope: "" if scope == COMMANDS else event.text):
            facts.append(TriggerMet(agent=event.agent, row=row.n, done=CHAT_DENIED if row.does == DENY else ""))
            if row.does == DENY:
                facts.append(ChatWordDenied(agent=event.agent, row=row.n))
        return facts


class SpotWhatTheAgentDoes(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, triggers: ReadRows[Trigger], settings: Settings) -> list[Fact]:
        if event.subagent or not settings.is_on(WATCHING):
            return []
        rows = firing(triggers, lambda scope: answered_words(event, scope))
        denying = next((row for row in rows if row.does == DENY), None)
        fired = list(takewhile(lambda row: row.does != DENY, rows))
        if denying and event.why.startswith(f"{denying.title} - "):
            fired.append(denying)
        return [TriggerMet(agent=event.agent, row=row.n) for row in fired]
