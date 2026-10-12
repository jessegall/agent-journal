
from events.agents import ToolFinished
from features.journal_laws.details import LARGEST_RESULT
from framework.parts import AgentContext, Handler


class NoticeLargestResult(Handler):
    behaviour = LARGEST_RESULT

    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        if event.size < int(context.settings.result_floor):
            return
        if event.size <= int(context.state.get("largest", 0)):
            return
        context.state.set("largest", event.size)
        context.agent.nudge(LARGEST_RESULT, tool=event.tool or "that tool", size=f"{event.size:,}")
