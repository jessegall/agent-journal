from engine.events import AgentUpdated
from engine.stored import read_json, write_json
from features.parts import Context, Handler

LARGEST_RESULT = "largest result"


class NoticeLargestResult(Handler):
    behaviour = LARGEST_RESULT

    def handle(self, context: Context, event: AgentUpdated) -> None:
        if event.hook != "PostToolUse" or not context.agent or event.size < int(context.settings.result_floor):
            return
        f = context.record.root / "runtime" / f"largest-result-{context.agent.session}.json"
        if event.size <= int(read_json(f, 0) or 0):
            return
        write_json(f, event.size)
        context.agent.whisper(LARGEST_RESULT, tool=event.tool or "that tool", size=f"{event.size:,}")
