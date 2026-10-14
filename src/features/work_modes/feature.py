from events.agents import ToolCallAnswered
from events.answers import Allowed, Refused as Declined
from events.asking import ToolCallAsked
from events.boards import BoardStarted
from events.work_modes import BuilderHandedAway, DriftChecked, EditCounted, OrchestratorDrifted
from expects import Answered, Dispatches, Given, Nudged, Refused, Remembered, Replied, Requested, Set, Told, Unchanged, nothing
from framework.base import Feature
from framework.journal import Journal
from declaring.registries import MODE, START_PARTS
from features.work_modes.answering import REFUSED, RefuseHelperInSolo
from features.work_modes.details import WorkModesDetails
from features.work_modes.handlers import ClearTheCount, CountTheEdit, NameTheBuildersHandingAway, NameTheOrchestratorsDrift, OrchestrateWhenABoardStarts
from features.work_modes.listeners import SpotEditOutsideTheJournal
from features.work_modes.modes import carried
from features.work_modes.routes import post_board, post_mode
from features.work_modes.shipped import SEQUENCES
from resources.types import AgentRow, Board
from resources.work_modes import MODE_SET

SOLO = {"work_modes.mode": "solo"}
BUILDER = {"work_modes.mode": "builder"}
ORCHESTRATOR = {"work_modes.mode": "orchestrator"}
HELPER_DISPATCH = 'journal helper dispatch Rhea "a job" --provider codex --model gpt-6-sol'
EDITED = ToolCallAnswered(agent=1, tool="Edit", input="{}", paths=("/work/a.py",))
CHANGED = {"edited": 0, "created": 0, "deleted": 0, "added": 0, "removed": 0}


def shell(command: str, subagent: bool = False) -> ToolCallAsked:
    return ToolCallAsked(tool="Bash", input=command, command=command, session="claude-1", subagent=subagent)


def editing(*made: int, name: str = "claude-1", **more) -> AgentRow:
    commands = [{"command": "edit", "tool": "Edit", "at": 100.0 + at, "changed": {**CHANGED, "edited": edited}} for at, edited in enumerate(made)]
    return AgentRow(n=1 if name == "claude-1" else 2, title=name, data={"commands": commands, **more})


class WorkModes(Feature):
    details = WorkModesDetails
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        journal.events.handle(BoardStarted, OrchestrateWhenABoardStarts(), expects=[
            Given(BoardStarted(n=1, type="board", action="started", actor="agent"), settings=BUILDER) >> Set("work_modes.mode", "orchestrator"),
            Given(BoardStarted(n=1, type="board", action="started", actor="agent"), settings=ORCHESTRATOR) >> Unchanged(),
        ])
        journal.routes.add(post_mode, expects=[
            Given(Requested({"mode": "orchestrator"}), settings=BUILDER) >> Replied(200, {"mode": "orchestrator"}) & Set("work_modes.mode", "orchestrator"),
            Given(Requested({"mode": "orchestrator"}), settings=BUILDER, rows=[AgentRow(n=1, title="claude-1"), AgentRow(n=2, title="claude-2")])
                >> Told(MODE_SET, times=2),
            Given(Requested({"mode": "orchestrator"}), settings=ORCHESTRATOR, rows=[AgentRow(n=1, title="claude-1")])
                >> Replied(200, {"mode": "orchestrator"}) & Told(MODE_SET, times=0),
            Given(Requested({"mode": "lazy"}), settings=BUILDER) >> Refused("the work mode is one of builder, orchestrator, solo, not 'lazy'") & Unchanged(),
        ])
        journal.routes.add(post_board, expects=[
            Given(Requested({"board": 1}), settings=ORCHESTRATOR, rows=[Board(n=1, title="Rewrite")]) >> Replied(200, {"board": 1}) & Set("work_modes.board", 1),
            Given(Requested({"board": 99}), settings=ORCHESTRATOR) >> Refused("there is no board 99 to send new work to") & Unchanged(),
            Given(Requested({"board": 0}), settings={**ORCHESTRATOR, "work_modes.board": 1}, rows=[Board(n=1, title="Rewrite")]) >> Replied(200, {"board": 0}) & Set("work_modes.board", 0),
        ])
        START_PARTS.add(self, carried, key=MODE)
        journal.events.answer(ToolCallAsked, RefuseHelperInSolo(), expects=[
            Given(shell(HELPER_DISPATCH), settings=SOLO) >> Answered(Declined(REFUSED)),
            Given(shell(HELPER_DISPATCH), settings=BUILDER) >> Answered(Allowed()),
            Given(shell("git status"), settings=SOLO) >> Answered(Allowed()),
            Given(shell(HELPER_DISPATCH, subagent=True), settings=SOLO) >> Answered(Allowed()),
            Given(ToolCallAsked(tool="Edit", input="{}", session="claude-1"), settings=SOLO) >> Answered(Allowed()),
        ])
        journal.events.listen(ToolCallAnswered, SpotEditOutsideTheJournal(), expects=[
            Given(EDITED, settings=ORCHESTRATOR) >> Dispatches(EditCounted(agent=1, mode="orchestrator", edits=1)),
            Given(EDITED, settings=ORCHESTRATOR, remembered={"work_modes.edits.orchestrator|1": 6}) >> Dispatches(EditCounted(agent=1, mode="orchestrator", edits=7)),
            Given(EDITED, settings=ORCHESTRATOR, remembered={"work_modes.edits.orchestrator|1": 7}) >> Dispatches(OrchestratorDrifted(agent=1, mode="orchestrator", edits=8)),
            Given(EDITED, settings={**BUILDER, "work_modes.drift_after": 2}, rows=[editing(5)], remembered={"work_modes.edits.builder|1": 1})
                >> Dispatches(DriftChecked(agent=1, mode="builder")),
            Given(EDITED, settings={**BUILDER, "work_modes.drift_after": 2}, rows=[editing(1, subagent_rows=[{"session": "claude-2"}]), editing(4, name="claude-2", parent="claude-1")],
                  remembered={"work_modes.edits.builder|1": 1})
                >> Dispatches(BuilderHandedAway(agent=1, mode="builder", share=20, own=1, theirs=4)),
            Given(EDITED, settings=SOLO) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="Read", input="{}", paths=("/work/a.py",)), settings=ORCHESTRATOR) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="Edit", input="{}", paths=("/work/a.py",), why="held"), settings=ORCHESTRATOR) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="Edit", input="{}", paths=("/work/a.py",), subagent=True), settings=ORCHESTRATOR) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="Edit", input="{}", paths=()), settings=ORCHESTRATOR) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="Write", input="{}", paths=("/work/a.py",)), settings=ORCHESTRATOR) >> Dispatches(EditCounted(agent=1, mode="orchestrator", edits=1)),
            Given(EDITED, settings=BUILDER) >> Dispatches(EditCounted(agent=1, mode="builder", edits=1)),
        ])
        journal.events.handle(EditCounted, CountTheEdit(), expects=[
            Given(EditCounted(agent=1, mode="orchestrator", edits=3), rows=[AgentRow(n=1, title="claude-1")]) >> Remembered("edits.orchestrator|1", 3),
        ])
        journal.events.handle(DriftChecked, ClearTheCount(), expects=[
            Given(DriftChecked(agent=1, mode="builder"), rows=[AgentRow(n=1, title="claude-1")], remembered={"work_modes.edits.builder|1": 8}) >> Remembered("edits.builder|1", 0),
        ])
        journal.events.handle(OrchestratorDrifted, NameTheOrchestratorsDrift(), expects=[
            Given(OrchestratorDrifted(agent=1, mode="orchestrator", edits=8), rows=[AgentRow(n=1, title="claude-1")])
                >> Nudged("drifted", edits=8) & Remembered("edits.orchestrator|1", 0),
        ])
        journal.events.handle(BuilderHandedAway, NameTheBuildersHandingAway(), expects=[
            Given(BuilderHandedAway(agent=1, mode="builder", share=20, own=1, theirs=4), rows=[AgentRow(n=1, title="claude-1")])
                >> Nudged("handed away", share=20, own=1, theirs=4) & Remembered("edits.builder|1", 0),
        ])
