from features.base import Feature
from features.sending import Sent
from features.trigger import MINUTE
from features.triggers.watched import FACTS, MINUTES, PERCENT, Fact
from features.journal import Journal
from features.triggers.controller import Triggers
from features.triggers.details import TriggersDetails
from features.triggers.handlers import (DenyWhatTheAgentDoes, HoldWhileTheJournalShows, SayWhatTheJournalShowsOnTheClock, SayWhatTheJournalShowsOnToolUse,
                                       WatchWhatTheAgentDoes, WatchWhatTheAgentWrites, WatchWhatTheUserWrites)

__all__ = ["Triggers"]


def agent_idle(context, agent, over: float) -> list[Sent]:
    return [Sent(agent.title, {"title": agent.title, "minutes": int(agent.idle_for / MINUTE)})] if agent.idle_for > over * MINUTE else []


def agent_context(context, agent, over: float) -> list[Sent]:
    return [Sent(agent.title, {"title": agent.title, "percent": int(float(agent.context))})] if float(agent.context) > over else []


class TriggersFeature(Feature):
    details = TriggersDetails

    def register(self, journal: Journal) -> None:
        FACTS.register(self, Fact("agent.idle", MINUTES, "The agent has been idle", "the agent has been idle for more than {over} minutes", agent_idle),
                       Fact("agent.context", PERCENT, "The agent's context is getting full", "the agent's context is more than {over} percent full", agent_context))
        journal.events.handler(WatchWhatTheUserWrites())
        journal.events.handler(WatchWhatTheAgentWrites())
        journal.events.handler(SayWhatTheJournalShowsOnTheClock())
        journal.events.handler(SayWhatTheJournalShowsOnToolUse())
        journal.events.handler(HoldWhileTheJournalShows())
        journal.agent.interceptor(DenyWhatTheAgentDoes())
        journal.agent.interceptor(WatchWhatTheAgentDoes())
