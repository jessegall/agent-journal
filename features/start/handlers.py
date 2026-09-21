from engine.events import AgentUpdated, AnyEvent
from features.parts import Context, Handler
from features.start.block import rebuild
from resources.types import TYPES

SHAPING = ("feature", "plugin", "environment")
SESSION_START = "SessionStart"


class GreetOnce(Handler):
    def handle(self, context: Context, event: AgentUpdated) -> None:
        if context.agent and context.agent.row.event == SESSION_START and context.once("greeted", "ready"):
            context.agent.type("ready", env=context.record.env)


class RebuildStartBlock(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type in TYPES and (TYPES[event.type].start_heading or event.type in SHAPING):
            rebuild(context.record)
