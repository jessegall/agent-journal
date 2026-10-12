from events.agents import AgentReported
from events.agents import AgentMessageSent, ClockTicked
from events.messages import MessageCreated
from expects import WHEN, Given, Held, Kept, Nudged, Refused, Unchanged, Updated, Wrote
from framework.base import Feature
from resources.triggers import Trigger
from payload import BashCall
from resources.base import USER
from resources.types import AgentRow, Message
from framework.sending import Sent
from declaring.trigger import MINUTE
from framework.watched import FACTS, MINUTES, PERCENT, Fact
from framework.journal import Journal
from controllers.types import Triggers
from features.triggers.details import TriggersDetails
from features.triggers.handlers import (DenyWhatTheAgentDoes, HoldWhileTheJournalShows, SayWhatTheJournalShowsOnTheClock, SayWhatTheJournalShowsOnToolUse,
                                       WatchWhatTheAgentDoes, WatchWhatTheAgentWrites, WatchWhatTheUserWrites)

__all__ = ["Triggers"]


def agent_idle(context, agent, over: float) -> list[Sent]:
    return [Sent(agent.title, {"title": agent.title, "minutes": int(agent.idle_for / MINUTE)})] if agent.idle_for > over * MINUTE else []


def agent_context(context, agent, over: float) -> list[Sent]:
    return [Sent(agent.title, {"title": agent.title, "percent": int(float(agent.context))})] if float(agent.context) > over else []


AGENT_ROW = AgentRow(n=1, title="claude-1")
NO_FORCE = Trigger(n=1, title="No force push", data={"words": ["--force"], "does": "deny", "text": "Never force push."})
DEPLOY_NUDGE = Trigger(n=2, title="Mind the gate", data={"words": ["deploy"], "does": "nudge", "text": "Run the gate first."})
DEPLOY_NOTE = Trigger(n=3, title="Deploy note", data={"words": ["deploy"], "does": "message", "text": "The agent is deploying."})
FROM_THE_USER = Trigger(n=4, title="Urgent", data={"words": ["urgent"], "words_in": "from the user", "does": "nudge", "text": "The user says it is urgent."})
IDLE_TOO_LONG = Trigger(n=5, title="Idle too long", data={"when": "state", "fact": "agent.idle", "over": 5, "does": "nudge", "text": "Pick up the next row."})
HOLD_WHEN_IDLE = Trigger(n=6, title="Hold while idle", data={"when": "state", "fact": "agent.idle", "over": 5, "does": "hold", "text": "Pick up the next row."})
LONG_IDLE = AgentRow(n=1, title="claude-1", data={"status": "idle", "at": 1.0})
JUST_NOW = AgentRow(n=1, title="claude-1", data={"status": "idle", "at": WHEN - 60})
WORKING = AgentRow(n=1, title="claude-1", data={"status": "working", "at": 1.0})

THE_WORD_FORCE = Trigger(n=7, title="No force", data={"words": ["force"], "does": "deny", "text": "Never force."})


def shell(command: str) -> BashCall:
    return BashCall.from_payload("Bash", {"command": command}, {})


def written(text: str, actor: str = USER) -> MessageCreated:
    return MessageCreated(n=7, type="message", action="created", actor=actor)


class TriggersFeature(Feature):
    details = TriggersDetails

    def register(self, journal: Journal) -> None:
        FACTS.register(self, Fact("agent.idle", MINUTES, "The agent has been idle", "the agent has been idle for more than {over} minutes", agent_idle,
                                  fills=("title", MINUTES)),
                       Fact("agent.context", PERCENT, "The agent's context is getting full", "the agent's context is more than {over} percent full", agent_context,
                            fills=("title", PERCENT)))
        journal.events.handler(WatchWhatTheUserWrites(), expects=[
            Given(written("x"), rows=[Message(n=7, title="Please deploy it"), DEPLOY_NUDGE, AGENT_ROW]) >> Nudged("nudge") & Updated(Trigger(n=2), matched=1),
            Given(written("x"), rows=[Message(n=7, title="This is urgent"), FROM_THE_USER, AGENT_ROW]) >> Nudged("nudge"),
            Given(written("x"), rows=[Message(n=7, title="Please build it"), DEPLOY_NUDGE, AGENT_ROW]) >> Unchanged(),
            Given(written("x", actor="agent"), rows=[Message(n=7, title="Please deploy it"), DEPLOY_NUDGE, AGENT_ROW]) >> Unchanged(),
            Given(written("x"), rows=[Message(n=7, title="Please deploy it", data={"trigger": 2}), DEPLOY_NUDGE, AGENT_ROW]) >> Unchanged(),
            Given(written("x"), rows=[Message(n=7, title="Please deploy it"), DEPLOY_NUDGE]) >> Unchanged(),
        ])
        journal.events.handler(WatchWhatTheAgentWrites(), expects=[
            Given(AgentMessageSent(agent=1, text="I will deploy now", turn="t1"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Nudged("nudge") & Updated(Trigger(n=2), matched=1),
            Given(AgentMessageSent(agent=1, text="I will build now", turn="t1"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Unchanged(),
            Given(AgentMessageSent(agent=1, text="I will git push --force it", turn="t1"), rows=[NO_FORCE, AGENT_ROW]) >> Nudged("denied") & Updated(Trigger(n=1), matched=1),
        ])
        journal.events.handler(SayWhatTheJournalShowsOnTheClock(), expects=[
            Given(ClockTicked(agent=1), rows=[IDLE_TOO_LONG, LONG_IDLE]) >> Nudged("nudge"),
            Given(ClockTicked(agent=1), rows=[IDLE_TOO_LONG, JUST_NOW]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[IDLE_TOO_LONG, WORKING]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[NO_FORCE, LONG_IDLE]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[LONG_IDLE]) >> Unchanged(),
        ])
        journal.events.handler(SayWhatTheJournalShowsOnToolUse(), expects=[
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, LONG_IDLE]) >> Nudged("nudge"),
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, JUST_NOW]) >> Unchanged(),
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, WORKING]) >> Unchanged(),
        ])
        journal.events.handler(HoldWhileTheJournalShows(), expects=[
            Given(AgentReported(agent=1), rows=[HOLD_WHEN_IDLE, LONG_IDLE]) >> Held("Hold while idle: Pick up the next row."),
            Given(AgentReported(agent=1), rows=[HOLD_WHEN_IDLE, JUST_NOW]) >> Unchanged(),
            Given(AgentReported(agent=1), rows=[HOLD_WHEN_IDLE, WORKING]) >> Unchanged(),
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, LONG_IDLE]) >> Unchanged(),
        ])
        journal.agent.interceptor(DenyWhatTheAgentDoes(), expects=[
            Given(shell("git push --force"), rows=[NO_FORCE, AGENT_ROW]) >> Refused("No force push - Never force push.") & Updated(Trigger(n=1), matched=1),
            Given(shell("git push"), rows=[NO_FORCE, AGENT_ROW]) >> Kept() & Unchanged(),
            Given(shell("git push --force"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Kept(),
            Given(shell("git push --force"), rows=[THE_WORD_FORCE, AGENT_ROW]) >> Kept(),
            Given(shell("git push force"), rows=[THE_WORD_FORCE, AGENT_ROW]) >> Refused("No force - Never force."),
        ])
        journal.agent.interceptor(WatchWhatTheAgentDoes(), expects=[
            Given(shell("make deploy"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Kept() & Nudged("nudge") & Updated(Trigger(n=2), matched=1),
            Given(shell("make deploy"), rows=[DEPLOY_NOTE, AGENT_ROW]) >> Kept() & Wrote(Message(title="Deploy note")),
            Given(shell("make build"), rows=[DEPLOY_NUDGE, DEPLOY_NOTE, AGENT_ROW]) >> Kept() & Unchanged(),
        ])
