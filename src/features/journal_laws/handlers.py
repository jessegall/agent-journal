from engine.events import ToolFinished
from features.parts import AgentContext, Handler

LARGEST_RESULT = "largest result"


class NoticeLargestResult(Handler):
    behaviour = LARGEST_RESULT

    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        if event.size < int(context.settings.result_floor):
            return
        if event.size <= int(context.state.get("largest", 0)):
            return
        context.state.set("largest", event.size)
        context.agent.whisper(LARGEST_RESULT, tool=event.tool or "that tool", size=f"{event.size:,}")
