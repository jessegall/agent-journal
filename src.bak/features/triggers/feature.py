from declaring.registries import STILL_HELD
from expects.calls import shell_answered, shell_asked
from events.agents import AgentMessageSent, AgentReported, ClockTicked, ToolCallAnswered
from events.answers import Allowed, Refused
from events.asking import ToolCallAsked
from events.messages import MessageCreated
from events.triggers import ChatWordDenied, TriggerHolding, TriggerMet, TriggerReleased, TriggerShowing
from expects import WHEN, Answered, answering, Dispatches, Given, Held, Nudged, Released, Remembered, Unchanged, Updated, Wrote, nothing
from framework.base import Feature
from resources.triggers import Trigger
from resources.base import USER
from resources.types import AgentRow, Message
from framework.sending import Sent
from declaring.trigger import MINUTE
from framework.watched import FACTS, MINUTES, PERCENT, Fact
from framework.journal import Journal
from controllers.types import Triggers
from features.triggers.answering import DenyWhatTheAgentDoes
from features.triggers.details import TriggersDetails
from features.triggers.handlers import DenyWordInChat, FireTrigger, HoldWhileTheJournalShows, ReleaseWhenTheJournalStopsShowing, SayWhatTheJournalShows
from features.triggers.listeners import (CHAT_DENIED, SpotWhatHoldsTheAgent, SpotWhatTheAgentDoes, SpotWhatTheAgentWrites, SpotWhatTheJournalShowsOnTheClock,
                                         SpotWhatTheJournalShowsOnToolUse, SpotWhatTheUserWrites)
from features.triggers.watching import REMINDING
from features.triggers.working import TriggersWork

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

BUMP_VERSION = Trigger(n=8, title="Bump the version", data={"words": ["tag"], "does": "instruct", "words_in": "commands", "text": "Update VERSION first."})
THE_WORD_FORCE = Trigger(n=7, title="No force", data={"words": ["force"], "does": "deny", "text": "Never force."})




def seen_idle(*found: Sent):
    return answering({("watching", row, 1): list(found) for row in (5, 6)})


IDLE_SEEN = seen_idle(Sent("claude-1", {"title": "claude-1", "minutes": int((WHEN - 1.0) / MINUTE)}))
NOTHING_SEEN = seen_idle()


def idle_showing() -> TriggerShowing:
    minutes = int((WHEN - 1.0) / MINUTE)
    return TriggerShowing(agent=1, row=5, does="nudge", key="claude-1", values=(("minutes", minutes), ("text", "Pick up the next row."), ("title", "Idle too long"))).once("5:claude-1")


def reminding(record, session: str) -> bool:
    """Whether the behaviour for facts is on, which is all that keeps a hold of a trigger standing: switching it off lets every one go."""
    from framework.loaded import FEATURES
    return FEATURES["triggers"].on(record, REMINDING)


def written(text: str, actor: str = USER) -> MessageCreated:
    return MessageCreated(n=7, type="message", action="created", actor=actor)


class TriggersFeature(TriggersWork, Feature):
    details = TriggersDetails

    def register(self, journal: Journal) -> None:
        FACTS.register(self, Fact("agent.idle", MINUTES, "The agent has been idle", "the agent has been idle for more than {over} minutes", agent_idle,
                                  fills=("title", MINUTES)),
                       Fact("agent.context", PERCENT, "The agent's context is getting full", "the agent's context is more than {over} percent full", agent_context,
                            fills=("title", PERCENT)))
        journal.events.listen(MessageCreated, SpotWhatTheUserWrites(), expects=[
            Given(written("x"), rows=[Message(n=7, title="Please deploy it"), DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(TriggerMet(agent=1, row=2, about="message:7")),
            Given(written("x"), rows=[Message(n=7, title="This is urgent"), FROM_THE_USER, AGENT_ROW]) >> Dispatches(TriggerMet(agent=1, row=4, about="message:7")),
            Given(written("x"), rows=[Message(n=7, title="Please build it"), DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(nothing),
            Given(written("x", actor="agent"), rows=[Message(n=7, title="Please deploy it"), DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(nothing),
            Given(written("x"), rows=[Message(n=7, title="Please deploy it", data={"trigger": 2}), DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(nothing),
            Given(written("x"), rows=[Message(n=7, title="Please deploy it"), DEPLOY_NUDGE]) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentMessageSent, SpotWhatTheAgentWrites(), expects=[
            Given(AgentMessageSent(agent=1, text="I will deploy now", turn="t1"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(TriggerMet(agent=1, row=2)),
            Given(AgentMessageSent(agent=1, text="I will build now", turn="t1"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(nothing),
            Given(AgentMessageSent(agent=1, text="I will git push --force it", turn="t1"), rows=[NO_FORCE, AGENT_ROW])
                >> Dispatches(TriggerMet(agent=1, row=1, done=CHAT_DENIED)) & Dispatches(ChatWordDenied(agent=1, row=1)),
        ])
        journal.events.listen(ToolCallAnswered, SpotWhatTheAgentDoes(), expects=[
            Given(shell_answered("make deploy"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(TriggerMet(agent=1, row=2)),
            Given(shell_answered("make deploy"), rows=[DEPLOY_NOTE, AGENT_ROW]) >> Dispatches(TriggerMet(agent=1, row=3)),
            Given(shell_answered("make build"), rows=[DEPLOY_NUDGE, DEPLOY_NOTE, AGENT_ROW]) >> Dispatches(nothing),
            Given(shell_answered("git push --force", why="No force push - Never force push."), rows=[NO_FORCE, AGENT_ROW]) >> Dispatches(TriggerMet(agent=1, row=1)),
            Given(shell_answered("git push --force", why="Something else"), rows=[NO_FORCE, AGENT_ROW]) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="Bash", input="make deploy", command="make deploy", subagent=True), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(TriggerMet, FireTrigger(), expects=[
            Given(TriggerMet(agent=1, row=2), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Nudged("nudge") & Updated(Trigger(n=2), matched=1)
                & Updated(AgentRow(n=1), cards=[{"label": "Trigger Mind the gate nudged the agent", "tone": "note"}]),
            Given(TriggerMet(agent=1, row=8), rows=[BUMP_VERSION, AGENT_ROW]) >> Nudged("instruct") & Updated(Trigger(n=8), matched=1)
                & Updated(AgentRow(n=1), cards=[{"label": "Trigger Bump the version instructed the agent", "tone": "note"}]),
            Given(TriggerMet(agent=1, row=3), rows=[DEPLOY_NOTE, AGENT_ROW]) >> Wrote(Message(title="Deploy note")),
            Given(TriggerMet(agent=1, row=1), rows=[NO_FORCE, AGENT_ROW]) >> Updated(Trigger(n=1), matched=1)
                & Updated(AgentRow(n=1), cards=[{"label": "Trigger No force push denied the call", "tone": "danger"}]),
        ])
        journal.events.handle(ChatWordDenied, DenyWordInChat(), expects=[
            Given(ChatWordDenied(agent=1, row=1), rows=[NO_FORCE, AGENT_ROW]) >> Nudged("denied"),
        ])
        journal.events.listen(ClockTicked, SpotWhatTheJournalShowsOnTheClock(), expects=[
            Given(ClockTicked(agent=1), rows=[IDLE_TOO_LONG, LONG_IDLE], own_work=IDLE_SEEN) >> Dispatches(idle_showing()),
            Given(ClockTicked(agent=1), rows=[IDLE_TOO_LONG, JUST_NOW], own_work=NOTHING_SEEN) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[IDLE_TOO_LONG, WORKING], own_work=NOTHING_SEEN) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[NO_FORCE, LONG_IDLE]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[LONG_IDLE]) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotWhatTheJournalShowsOnToolUse(), expects=[
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, LONG_IDLE], own_work=IDLE_SEEN) >> Dispatches(idle_showing()),
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, JUST_NOW], own_work=NOTHING_SEEN) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, WORKING], own_work=NOTHING_SEEN) >> Dispatches(nothing),
        ])
        journal.events.handle(TriggerShowing, SayWhatTheJournalShows(), expects=[
            Given(idle_showing(), rows=[IDLE_TOO_LONG, LONG_IDLE]) >> Nudged("nudge") & Remembered("sent|5:claude-1", 1),
        ])
        journal.events.listen(AgentReported, SpotWhatHoldsTheAgent(), expects=[
            Given(AgentReported(agent=1), rows=[HOLD_WHEN_IDLE, LONG_IDLE], own_work=IDLE_SEEN) >> Dispatches(TriggerHolding(agent=1, row=6, title="Hold while idle", text="Pick up the next row.")),
            Given(AgentReported(agent=1), rows=[HOLD_WHEN_IDLE, JUST_NOW], own_work=NOTHING_SEEN) >> Dispatches(TriggerReleased(agent=1, row=6)),
            Given(AgentReported(agent=1), rows=[HOLD_WHEN_IDLE, WORKING], own_work=NOTHING_SEEN) >> Dispatches(TriggerReleased(agent=1, row=6)),
            Given(AgentReported(agent=1), rows=[IDLE_TOO_LONG, LONG_IDLE], own_work=IDLE_SEEN) >> Dispatches(nothing),
        ])
        journal.events.handle(TriggerHolding, HoldWhileTheJournalShows(), expects=[
            Given(TriggerHolding(agent=1, row=6, title="Hold while idle", text="Pick up the next row."), rows=[HOLD_WHEN_IDLE, LONG_IDLE])
                >> Held("Hold while idle: Pick up the next row."),
        ])
        journal.events.handle(TriggerReleased, ReleaseWhenTheJournalStopsShowing(), expects=[
            Given(TriggerReleased(agent=1, row=6), rows=[HOLD_WHEN_IDLE, JUST_NOW]) >> Unchanged(),
            Given(TriggerReleased(agent=1, row=6), rows=[HOLD_WHEN_IDLE, JUST_NOW], held="Hold while idle: Pick up the next row.", held_under="hold.6") >> Released(),
        ])
        journal.events.answer(ToolCallAsked, DenyWhatTheAgentDoes(), expects=[
            Given(shell_asked("git push --force"), rows=[NO_FORCE, AGENT_ROW]) >> Answered(Refused("No force push - Never force push.")),
            Given(shell_asked("git push"), rows=[NO_FORCE, AGENT_ROW]) >> Answered(Allowed()),
            Given(shell_asked("git push --force"), rows=[DEPLOY_NUDGE, AGENT_ROW]) >> Answered(Allowed()),
            Given(shell_asked("git push --force"), rows=[THE_WORD_FORCE, AGENT_ROW]) >> Answered(Refused("No force - Never force.")),
            Given(shell_asked("git push --force-with-lease"), rows=[THE_WORD_FORCE, AGENT_ROW]) >> Answered(Allowed()),
            Given(shell_asked("git config enforce.on true"), rows=[THE_WORD_FORCE, AGENT_ROW]) >> Answered(Allowed()),
            Given(shell_asked("git push force"), rows=[THE_WORD_FORCE, AGENT_ROW]) >> Answered(Refused("No force - Never force.")),
            Given(ToolCallAsked(tool="Bash", input="git push --force", command="git push --force", session="claude-1", subagent=True), rows=[NO_FORCE, AGENT_ROW]) >> Answered(Allowed()),
        ])
        STILL_HELD["triggers.hold"] = reminding
