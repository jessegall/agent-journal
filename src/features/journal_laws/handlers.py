from engine.events.agents import ToolFinished
from features.nudges import Sent
from features.parts import AgentContext, Handler
from providers import PROVIDERS

LARGEST_RESULT = "largest result"
TOO_LONG = "too long"
BAND = 4096


class NoticeLargestResult(Handler):
    behaviour = LARGEST_RESULT

    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        if event.size < int(context.settings.result_floor):
            return
        if event.size <= int(context.state.get("largest", 0)):
            return
        context.state.set("largest", event.size)
        context.agent.whisper(LARGEST_RESULT, tool=event.tool or "that tool", size=f"{event.size:,}")


def long_briefings(context, agent) -> list[Sent]:
    project = context.record.root.parent
    files = [(cls, project / cls.briefing_file) for cls in PROVIDERS.values() if cls.briefing_limit()]
    sizes = [(cls, target, target.stat().st_size) for cls, target in files if target.is_file()]
    return [Sent(f"{target.name}:{size // BAND}", {"file": target.name, "size": f"{size:,}", "limit": f"{cls.briefing_limit():,}", "provider": cls.name.title()})
            for cls, target, size in sizes if size > cls.briefing_limit()]
