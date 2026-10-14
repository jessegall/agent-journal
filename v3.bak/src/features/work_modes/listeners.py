from pathlib import Path

from events import Fact
from events.agents import ToolCallAnswered
from events.work_modes import BuilderHandedAway, DriftChecked, EditCounted, OrchestratorDrifted
from features.work_modes.details import BUILDER, ORCHESTRATOR
from features.work_modes.modes import kept_mode
from features.work_modes.share import share
from receiving import Listener
from resources.types import AgentRow, Helper, Work
from serving import ReadElsewhere, ReadRemembered, ReadRows, Settings

EDITING = ("Edit", "MultiEdit", "Write", "NotebookEdit")


def edits_key(mode: str, agent: int) -> str:
    return f"edits.{mode}|{agent}"


class SpotEditOutsideTheJournal(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, settings: Settings, remembered: ReadRemembered, agents: ReadRows[AgentRow], works: ReadRows[Work],
               helpers: ReadRows[Helper], elsewhere: ReadElsewhere) -> list[Fact]:
        mode = kept_mode(settings.mode)
        if event.subagent or event.why or event.tool not in EDITING or not event.paths or mode not in (ORCHESTRATOR, BUILDER):
            return []
        edited = Path(event.cwd) / event.paths[0] if event.cwd else Path(event.paths[0])
        if edited.resolve().is_relative_to(elsewhere.here().record.root.resolve()):
            return []
        edits = int(remembered.get(edits_key(mode, event.agent)) or 0) + 1
        if edits < int(settings.drift_after):
            return [EditCounted(agent=event.agent, mode=mode, edits=edits)]
        if mode == ORCHESTRATOR:
            return [OrchestratorDrifted(agent=event.agent, mode=mode, edits=edits)]
        own, theirs = share(agents, works, helpers, elsewhere)
        made = own + theirs
        if not made or own * 100 >= int(settings.own_share) * made:
            return [DriftChecked(agent=event.agent, mode=mode)]
        return [BuilderHandedAway(agent=event.agent, mode=mode, share=int(own * 100 / made), own=own, theirs=theirs)]
