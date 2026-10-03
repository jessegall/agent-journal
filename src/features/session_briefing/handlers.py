from engine import bus
from engine.events.agents import SessionStarted
from engine.events.resources import AnyEvent
from features.parts import AgentContext, Context, Handler, in_background
from features.session_briefing.block import rebuild
from resources.types import TYPES

SHAPING = ("feature", "plugin", "environment")


class GreetOnce(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        if not in_background(context.record) and context.once("greeted", "ready"):
            context.agent.whisper("ready", env=context.record.env)


class RebuildStartBlock(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type in TYPES and (TYPES[event.type].start_heading or event.type in SHAPING):
            record = context.record
            bus.defer_once(f"start block {record.root} {record.env}", lambda: rebuild(record))
