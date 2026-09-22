from engine.events import AgentUpdated, ResourceCreated
from features.memory_checkpoints.reread import owed
from features.parts import AgentContext, Context, Handler

DECISIONS = ("fact", "rule")


class DecideAtMarks(Handler):
    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        if context.agent.row.decided:
            context.release()
        elif context.due():
            percent = context.agent.row.context
            context.hold("decide held", percent=percent)
            context.agent.say("decide", percent=percent)


class ReleaseOnceDecided(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in DECISIONS:
            context.release()


class NameOwedReading(Handler):
    behaviour = "rereading"

    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        if owed(context.record):
            context.agent.say("reread")
