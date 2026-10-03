from engine.events.agents import SessionStarted, ToolFinished
from features.journal_laws.policy import project_text
from features.sequences.shipped import CHECKING_THE_INSTRUCTION_FILES
from features.nudges import Sent
from features.parts import AgentContext, Handler, in_background
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


class CheckChangedInstructions(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        if in_background(context.record):
            return
        state, seen = context.record.state(context.feature.name), project_text(context.record.root.parent)
        if not seen or state.get("instructions") == seen:
            return
        state.set("instructions", seen)
        sequences = context.journal.sequences
        found = sequences._titled(CHECKING_THE_INSTRUCTION_FILES.title)
        if found is not None:
            sequences.run(found.n)
