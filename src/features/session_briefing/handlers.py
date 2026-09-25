from engine.events import AnyEvent, SessionStarted
from features.parts import AgentContext, Context, Handler, in_background
from features.session_briefing.block import rebuild
from resources.types import TYPES

SHAPING = ("feature", "plugin", "environment")


class GreetOnce(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        if not in_background(context.record) and context.once("greeted", "ready"):
            context.agent.type("ready", env=context.record.env)


class RebuildStartBlock(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type in TYPES and (TYPES[event.type].start_heading or event.type in SHAPING):
            rebuild(context.record)
