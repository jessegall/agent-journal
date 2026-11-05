from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.step_checks import StepChecks
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun
from core.modules.sequences.commands.support.sequence_line import SequenceLine
from core.modules.sequences.commands.support.step_line import StepLine
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_guards import SequenceGuards

START, FOLLOW, NEXT, ABANDON, END = "start", "follow", "next", "abandon", "end"
FINISHED, ABANDONED, ENDED = "finished", "abandoned", "ended"


class MoveSequenceRunHandler(Handler[MoveSequenceRun, SequenceLine]):
    """Starts, takes up, moves on, ends and abandons the calling agent's one sequence run. A step moves on, or the
    sequence ends, only once the checks the step lists have passed; abandoning needs none."""

    command = MoveSequenceRun

    def __init__(self, runs: SequenceRunQuery, repository: Repository, checks: StepChecks, rows: EventRows) -> None:
        self.runs, self.repository, self.checks = runs, repository, checks
        self.rows = rows

    def handle(self, command: MoveSequenceRun, context: Context) -> SequenceLine:
        current = self.runs.current(context.actor.id)
        if command.action == START:
            return self.start(command, current, context)
        if current is None:
            raise Refusal("no sequence is running", "journal sequence run <n> starts one")
        sequence = self.rows.required(Sequence, current.sequence_id)
        if command.action == END:
            self.repository.save(replace(current, ended_at=context.timestamp, outcome=f"{ENDED}: {command.reason}"), context)
            return SequenceLine(f"sequence {sequence.id} ended: {command.reason}")
        if command.action == FOLLOW:
            return SequenceLine(StepLine.text(sequence, self.repository.save(replace(current, step_started=True), context)))
        if not current.step_started:
            raise Refusal(f"step {current.step_number} of sequence {sequence.id} was never taken up", "journal sequence follow first")
        if command.action == NEXT:
            self.require_checks(sequence, current)
            return self.next_step(sequence, current, context)
        undone_steps = ", ".join(sequence.steps[current.step_number - 1:])
        if not command.sure:
            raise Refusal(f"abandoning sequence {sequence.id}, {sequence.title}, leaves undone: {undone_steps}", "again with --sure to go through")
        self.repository.save(replace(current, ended_at=context.timestamp, outcome=f"{ABANDONED}: {command.reason}"), context)
        return SequenceLine(f"sequence {sequence.id} abandoned")

    def start(self, command: MoveSequenceRun, current: SequenceRun | None, context: Context) -> SequenceLine:
        if current is not None:
            raise Refusal(f"sequence {current.sequence_id} is running", "finish it with journal sequence next, or give it up with journal sequence abandon")
        if command.sequence_id is None:
            raise Refusal("name the sequence to run", "journal sequence run <n>")
        agent = self.rows.find(Agent, context.actor.id)
        if agent is None:
            raise Refusal("only an agent runs a sequence", "the agent runs journal sequence run <n>")
        sequence = self.rows.required(Sequence, command.sequence_id)
        run = self.repository.save(SequenceRun(session_agent_id=context.actor.id, sequence_id=sequence.id, subject_id=command.subject_id), context)
        return SequenceLine(StepLine.text(sequence, run))

    def require_checks(self, sequence: Sequence, current: SequenceRun) -> None:
        unpassed = self.checks.unpassed(SequenceGuards.step_guard(sequence.step_guards, current.step_number).checks)
        if unpassed:
            raise Refusal(f"step {current.step_number} of sequence {sequence.id} waits on checks that have not passed: {', '.join(f'check {number}' for number in unpassed)}",
                          f"run journal check run {unpassed[0]}, put right what it finds, then journal sequence next")

    def next_step(self, sequence: Sequence, current: SequenceRun, context: Context) -> SequenceLine:
        if current.step_number >= len(sequence.steps):
            self.repository.save(replace(current, ended_at=context.timestamp, outcome=FINISHED), context)
            return SequenceLine(f"sequence {sequence.id} ran its last step")
        moved = self.repository.save(replace(current, step_number=current.step_number + 1, step_started=False), context)
        return SequenceLine(StepLine.text(sequence, moved))
