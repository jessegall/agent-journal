from dataclasses import replace

from core.base.command.context import Context
from core.base.command.completed_command_error import CompletedCommandError
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.base.module.step_conditions import StepConditions
from engine.check.step_checks import StepChecks
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun
from core.modules.sequences.commands.support.sequence_line import SequenceLine
from core.modules.sequences.commands.support.step_line import StepLine
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.models.support.sequence_guards import SequenceGuards

START, FOLLOW, NEXT, ABANDON, END = "start", "follow", "next", "abandon", "end"
FINISHED, ABANDONED, ENDED = "finished", "abandoned", "ended"


class MoveSequenceRunHandler(Handler[MoveSequenceRun, SequenceLine]):
    """Moves an agent's sequence run and reports the next step."""

    command = MoveSequenceRun

    def __init__(self, runs: SequenceRunQuery, repository: Repository, checks: StepChecks, rows: EventRows, conditions: StepConditions) -> None:
        self.runs, self.repository, self.checks, self.conditions = runs, repository, checks, conditions
        self.rows = rows

    def handle(self, command: MoveSequenceRun, context: Context) -> SequenceLine:
        current = self.runs.current(context.actor.id)
        if command.action == START:
            return self.start(command, context)
        if current is None:
            raise Refusal("no sequence is running", "journal sequence run <n> starts one")
        sequence = self.rows.required(Sequence, current.sequence_id)
        if command.action == END:
            return self.end(command, current, context)
        if command.action == FOLLOW:
            return SequenceLine(StepLine.text(sequence, self.repository.save(replace(current, step_started=True), context)))
        if not current.step_started:
            raise Refusal(f"step {current.step_number} of sequence {sequence.id} was never taken up", "journal sequence follow first")
        if command.action == NEXT:
            self.require_checks(sequence, current)
            self.require_conditions(sequence, current)
            return self.next_step(sequence, current, context)
        undone_steps = ", ".join(sequence.steps[current.step_number - 1:])
        if not command.sure:
            raise Refusal(f"abandoning sequence {sequence.id}, {sequence.title}, leaves undone: {undone_steps}", "again with --sure to go through")
        self.repository.save(replace(current, ended_at=context.timestamp, outcome=f"{ABANDONED}: {command.reason}"), context)
        return self.with_resumed_run(f"sequence {sequence.id} abandoned", context)

    def end(self, command: MoveSequenceRun, current: SequenceRun, context: Context) -> SequenceLine:
        target = current if command.run_id is None else self.rows.required(SequenceRun, command.run_id)
        self.repository.save(replace(target, ended_at=context.timestamp, outcome=f"{ENDED}: {command.reason}"), context)
        text = f"sequence {target.sequence_id} ended: {command.reason}"
        return self.with_resumed_run(text, context) if target.id == current.id else SequenceLine(text)

    def with_resumed_run(self, text: str, context: Context) -> SequenceLine:
        resumed = self.runs.current(context.actor.id)
        if resumed is None:
            return SequenceLine(text)
        return SequenceLine(f"{text}\n{StepLine.text(self.rows.required(Sequence, resumed.sequence_id), resumed)}")

    def start(self, command: MoveSequenceRun, context: Context) -> SequenceLine:
        if command.sequence_id is None:
            raise Refusal("name the sequence to run", "journal sequence run <n>")
        if self.runs.is_running(context.actor.id, command.sequence_id):
            raise CompletedCommandError(f"sequence {command.sequence_id} is already running", "finish it with journal sequence next, or give it up with journal sequence abandon")
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

    def require_conditions(self, sequence: Sequence, current: SequenceRun) -> None:
        if current.subject_id is None:
            return
        problems = self.conditions.problems(SequenceGuards.step_guard(sequence.step_guards, current.step_number).conditions, current.subject_id)
        if problems:
            raise Refusal(f"step {current.step_number} of sequence {sequence.id} is not complete: {'; '.join(problems)}", "put that right, then go to the next step")

    def next_step(self, sequence: Sequence, current: SequenceRun, context: Context) -> SequenceLine:
        if current.step_number >= len(sequence.steps):
            self.repository.save(replace(current, ended_at=context.timestamp, outcome=FINISHED), context)
            return self.with_resumed_run(f"sequence {sequence.id} ran its last step", context)
        moved = self.repository.save(replace(current, step_number=current.step_number + 1, step_started=False), context)
        return SequenceLine(StepLine.text(sequence, moved))
