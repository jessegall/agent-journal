from engine import bus
from events.agents import SessionStarted
from events.boards import BoardOrchestrated
from events.resources import AnyEvent
from framework.parts import AgentContext, Context, Handler, in_background
from features.session_briefing.block import rebuild
from resources.types import TYPES

SHAPING = ("feature", "plugin", "environment")


class GreetOnce(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        if not in_background(context.record) and context.once("greeted", "ready"):
            context.agent.nudge("ready", env=context.record.env)


def rebuild_soon(record) -> None:
    key = f"start block {record.root} {record.env}"
    bus.defer_once(key, lambda: bus.background(key, lambda: rebuild(record)))


class RebuildStartBlock(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type in TYPES and (TYPES[event.type].start_heading or event.type in SHAPING) and not event.section and not event.is_read_mark:
            rebuild_soon(context.record)


class RebuildWhenOrchestrating(Handler):
    def handle(self, context: Context, event: BoardOrchestrated) -> None:
        rebuild_soon(context.record)
