from dataclasses import replace
from datetime import timedelta

from engine.cli.row_numbers import RowNumbers
from engine.command.bus import Bus
from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from engine.time.timestamp import Timestamp
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from core.modules.waits.commands.end_wait.end_wait import EndWait
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.ask_deadline import AskDeadline
from suites.coding.modules.workers.support.worker_settings import QUESTION_ANSWER_MINUTES, QUESTION_FORWARD_MINUTES

CLOCK_FORMAT = "%H:%M"


class WorkerQuestions:
    """The questions workers asked the merger and how each ended. A question is a merger line with a
    worker; it is open until it gets one outcome, and this is the one place that gives it. Closing a
    question ends the wait the worker opened for it, writes a line in the log of its task and, unless the
    worker is gone, sends the worker the outcome as a message, which wakes it. A forwarded question keeps
    the wait open, since the main agent still answers it."""

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, settings: SettingValues, numbers: RowNumbers) -> None:
        self.queries, self.repository, self.bus, self.settings, self.numbers = queries, repository, bus, settings, numbers

    def open_lines(self) -> tuple[MergerLine, ...]:
        return tuple(self.queries.query(MergerLine).matching(HasValue("worker_id")).matching(IsNull("outcome")).oldest().all_rows())

    def worker_lines(self, worker_id: int) -> tuple[MergerLine, ...]:
        return tuple(self.queries.query(MergerLine).filter(worker_id=worker_id).matching(IsNull("outcome")).oldest().all_rows())

    def task_lines(self, task_id: int) -> tuple[MergerLine, ...]:
        return tuple(self.queries.query(MergerLine).filter(task_id=task_id).matching(HasValue("worker_id")).matching(IsNull("outcome")).oldest().all_rows())

    def find_line(self, line_id: int) -> MergerLine:
        line = self.queries.query(MergerLine).filter(id=line_id).first()
        if line is None or line.worker_id is None:
            raise Refusal(f"line {line_id} is not a worker's question", "journal merger next lists the questions that wait")
        return line

    def timed(self, line: MergerLine, wait_id: int, task_id: int | None, timestamp: Timestamp) -> MergerLine:
        due_at = Timestamp(timestamp.value + timedelta(minutes=self.settings.number(QUESTION_ANSWER_MINUTES)))
        forward_at = Timestamp(timestamp.value + timedelta(minutes=self.settings.number(QUESTION_FORWARD_MINUTES)))
        return replace(line, wait_id=wait_id, task_id=task_id, due_at=due_at, forward_at=forward_at)

    def close(self, line: MergerLine, outcome: AskOutcome, text: str, context: Context) -> None:
        closed = self.record(line, outcome, text, context)
        self.bus.dispatch(SendAgentMessage(closed.worker_id, outcome.worker_line(text), is_counted=True), context)

    def close_oldest(self, worker_id: int, outcome: AskOutcome, text: str, context: Context) -> None:
        lines = self.worker_lines(worker_id)
        if lines:
            self.close(lines[0], outcome, text, context)

    def close_worker_lines(self, worker_id: int, reason: str, context: Context) -> None:
        for line in self.worker_lines(worker_id):
            self.record(line, AskOutcome.MOOT, reason, context)

    def due_workers(self, visits_limit: int, timestamp: Timestamp) -> tuple[int, ...]:
        return tuple(dict.fromkeys(line.worker_id for line in self.open_lines() if AskDeadline.from_line(line, visits_limit).is_forward_due(timestamp)))

    def close_idle_line(self, line: MergerLine, context: Context) -> None:
        self.record(line, AskOutcome.MOOT, "the worker works again", context)

    def close_task_lines(self, task_id: int, reason: str, context: Context) -> None:
        for line in self.task_lines(task_id):
            self.record(line, AskOutcome.MOOT, reason, context)

    def record(self, line: MergerLine, outcome: AskOutcome, text: str, context: Context) -> MergerLine:
        if line.outcome is not None and line.closed_at is not None:
            raise Refusal(f"line {line.id} is settled: {line.outcome.description()} at {line.closed_at.value.strftime(CLOCK_FORMAT)}")
        closed = self.repository.save_change(line, replace(line, outcome=outcome, closed_at=context.timestamp), context)
        wait = self.queries.query(Wait).filter(id=line.wait_id).first() if line.wait_id is not None else None
        if wait is not None and wait.state is WaitState.OPEN and outcome is not AskOutcome.FORWARDED:
            self.bus.dispatch(EndWait(wait.id, outcome=outcome.worker_line(text)), context)
        if line.task_id is not None:
            worker = AgentLabel.from_row_id(line.worker_id, self.numbers, "worker").text
            self.bus.dispatch(MakeTaskLog(line.task_id, f"the question of {worker} (line {line.id}) ended as {outcome.description()}: {text}"), context)
        return closed
