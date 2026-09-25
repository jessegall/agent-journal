from controllers.types import CONTROLLERS
from engine.events import AgentReported, ResourceCreated
from features.memory_checkpoints.reread import owed
from features.parts import AgentContext, Context, Handler, OnAgentUpdated
from resources.base import AGENT, SYSTEM
from resources.types import TYPES

DECISIONS = ("fact", "rule")
MARKED = {"fact": "Wrote a fact", "rule": "Wrote a rule", "reminder": "Set a reminder"}


class DecideAtMarks(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if context.agent.row.decided:
            context.release()
        elif context.due():
            percent = int(context.agent.row.context)
            context.hold("decide held", percent=percent)
            context.agent.say("decide", percent=percent)


class ReleaseOnceDecided(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in DECISIONS:
            context.release()


class MarkWhatWasKept(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type not in MARKED or event.actor != AGENT:
            return
        agents = context.journal.acting(SYSTEM).agents
        row, kept = agents.primary(), CONTROLLERS[event.type](context.record, actor=SYSTEM).load(event.n)
        if row:
            agents.card(row.n, label=MARKED[event.type], icon=TYPES[event.type].icon, detail=kept.title, ref=kept.ref)


class NameOwedReading(Handler):
    behaviour = "rereading"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if owed(context.record):
            context.agent.say("reread")


class DecideAtMarksOnChange(OnAgentUpdated, DecideAtMarks):
    pass
