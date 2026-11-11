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
from core.modules.processes.support.reading.reading_case import ReadingCase
from core.modules.processes.support.reading.reading_facts import ReadingFacts
from core.modules.processes.support.reading.unreadable_marks import UnreadableMarks

RUNS_COMPARED = 2


class UnreadableMarker:
    """Marks a command unreadable at the end of a run when this run and the run of the same command before it
    gave the same measured reason, and lifts the mark when a marked command printed readable lines on two ended
    runs in a row since it was marked. It goes by measures only, never by the words a run printed."""

    def __init__(self, facts: ReadingFacts, decisions: ReadingDecisionQuery, marks: UnreadableMarks, rows: EventRows, outputs: OutputQuery,
                 parts: ProcessPartQuery) -> None:
        self.facts, self.decisions, self.marks, self.rows, self.outputs, self.parts = facts, decisions, marks, rows, outputs, parts

    def changes(self, process: Process, parts: tuple[ProcessPart, ...], context: Context) -> tuple[UnreadableMark, ...]:
        return tuple(change for part in parts if part.category.has_reader for change in self.part_changes(process, part, context))

    def part_changes(self, process: Process, part: ProcessPart, context: Context) -> tuple[UnreadableMark, ...]:
        case = self.facts.case_for(process, part, ReadingMoment.END)
        previous = self.previous_case(process, case.command_key)
        if previous is None:
            return ()
        reason = case.measured_unreadable_reason
        mark = self.marks.marked(case.command_key)
        if mark is None and reason is not None and previous[1].measured_unreadable_reason is reason:
            return tuple([self.marks.mark(CORE_ACTOR_ID, case.command_key, reason, "", context)])
        if mark is not None and reason is None and previous[1].measured_unreadable_reason is None and previous[0].creation_timestamp() > mark.creation_timestamp():
            return tuple([self.marks.lift(mark.words, CORE_ACTOR_ID, context)])
        return ()

    def previous_case(self, process: Process, command_key: str) -> tuple[Process, ReadingCase] | None:
        """The run of the same command that ended before this one, with its facts, while its output is kept."""
        rows = self.decisions.for_command_key(command_key).filter(moment=ReadingMoment.END).descending("decided_at", "id").limited(RUNS_COMPARED)
        row = next((row for row in rows if row.process_id != process.id), None)
        if row is None:
            return None
        earlier = self.rows.required(Process, row.process_id)
        output = self.outputs.process_output(earlier.id)
        part = self.parts.filter(process_id=earlier.id, position=row.part_position).first()
        if output is None or output.state is not OutputState.KEPT or part is None:
            return None
        return earlier, self.facts.case_for(earlier, part, ReadingMoment.END)
