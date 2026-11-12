from engine.actor.actor import CORE_ACTOR_ID
from engine.command.context import Context
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.reading.reading_facts import ReadingFacts
from core.modules.processes.support.unreadable.unreadable_marks import UnreadableMarks
from core.modules.processes.support.silent_start_runs import SilentStartRuns

RUNS_COMPARED = 2


class UnreadableMarker:
    """Marks a command unreadable at the end of a run when this run and the run of the same command before it
    gave the same measured reason, and lifts the mark when a marked command printed readable lines on two ended
    runs in a row since it was marked. It goes by measures only, never by the words a run printed."""

    def __init__(self, facts: ReadingFacts, decisions: ReadingDecisionQuery, marks: UnreadableMarks, rows: EventRows, outputs: OutputQuery,
                 parts: ProcessPartQuery) -> None:
        self.facts, self.decisions, self.marks, self.rows, self.outputs, self.parts = facts, decisions, marks, rows, outputs, parts

    def changes(self, process: Process, parts: tuple[ProcessPart, ...], context: Context) -> tuple[UnreadableMark, ...]:
        """The marks made or lifted for the commands of a run, each command once, by its first part."""
        commands = {SilentStartRuns.name(part.text, part.program, part.category): part for part in reversed(parts) if part.category.has_reader}
        return tuple(change for command_key, part in commands.items() for change in self.part_changes(process, command_key, part, context))

    def part_changes(self, process: Process, command_key: str, part: ProcessPart, context: Context) -> tuple[UnreadableMark, ...]:
        previous = self.previous_run(process, command_key)
        if previous is None:
            return ()
        reason, earlier_reason = self.facts.measured_reason(process, part), self.facts.measured_reason(*previous)
        mark = self.marks.marked(command_key)
        if mark is None and reason is not None and earlier_reason is reason:
            return tuple([self.marks.mark(CORE_ACTOR_ID, command_key, reason, "", context)])
        if mark is not None and reason is None and earlier_reason is None and previous[0].creation_timestamp() >= mark.creation_timestamp():
            return tuple([self.marks.lift(mark.words, CORE_ACTOR_ID, context)])
        return ()

    def previous_run(self, process: Process, command_key: str) -> tuple[Process, ProcessPart] | None:
        """The part of the run of the same command that ended before this one, while its output is kept."""
        rows = self.decisions.for_command_key(command_key).filter(moment=ReadingMoment.END).descending("decided_at", "id").take(RUNS_COMPARED)
        row = next((row for row in rows if row.process_id != process.id), None)
        if row is None:
            return None
        output = self.outputs.process_output(row.process_id)
        part = self.parts.filter(process_id=row.process_id, position=row.part_position).first()
        if output is None or output.state is not OutputState.KEPT or part is None:
            return None
        return self.rows.required(Process, row.process_id), part
