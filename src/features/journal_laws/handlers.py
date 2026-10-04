
from engine.events.agents import SessionStarted, ToolFinished
from features.journal_laws.briefing import instructions_hash
from features.journal_laws.details import LARGEST_RESULT
from features.sequences.shipped import CHECKING_THE_INSTRUCTION_FILES
from features.parts import AgentContext, Handler, in_background



class NoticeLargestResult(Handler):
    behaviour = LARGEST_RESULT

    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        if event.size < int(context.settings.result_floor):
            return
        if event.size <= int(context.state.get("largest", 0)):
            return
        context.state.set("largest", event.size)
        context.agent.whisper(LARGEST_RESULT, tool=event.tool or "that tool", size=f"{event.size:,}")


class CheckChangedInstructions(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        if in_background(context.record):
            return
        state, seen = context.record.state(context.feature.name), instructions_hash(context.record.root.parent, context.record)
        known = state.get("instructions")
        if not seen or known == seen:
            return
        state.set("instructions", seen)
        if not known:
            return
        sequences = context.journal.sequences
        found = sequences._titled(CHECKING_THE_INSTRUCTION_FILES.title)
        if found is not None:
            sequences.run(found.n)
