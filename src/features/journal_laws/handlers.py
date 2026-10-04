from pathlib import Path

from engine.events.agents import SessionStarted, ToolFinished
from features.journal_laws.policy import instructions_hash
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
    cls, project = PROVIDERS.get(agent.provider), context.record.root.parent.resolve()
    if cls is None or not cls.briefing_limit():
        return []
    files = read_on_the_way(project, Path(agent.cwd) if agent.cwd else project, cls.briefing_file)
    size = sum(f.stat().st_size for f in files)
    if size <= cls.briefing_limit():
        return []
    names = " with ".join(str(f.relative_to(project)) for f in files)
    return [Sent(f"{names}:{size // BAND}", {"file": names, "size": f"{size:,}", "limit": f"{cls.briefing_limit():,}", "provider": cls.name.title()})]


def read_on_the_way(project: Path, cwd: Path, name: str) -> list[Path]:
    inside = cwd.resolve() if cwd.resolve().is_relative_to(project) else project
    folders = [project, *reversed([p for p in inside.parents if p.is_relative_to(project) and p != project]), inside]
    return [f / name for f in dict.fromkeys(folders) if (f / name).is_file()]


class CheckChangedInstructions(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        if in_background(context.record):
            return
        state, seen = context.record.state(context.feature.name), instructions_hash(context.record.root.parent)
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
