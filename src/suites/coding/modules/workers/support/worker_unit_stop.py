from engine.request.request_values import RequestValues
from suites.coding.modules.workers.support.worker_unit_stop_answer import WorkerUnitStopAnswer
from engine.cli.row_numbers import RowNumbers
from engine.driver.agent_message import AgentMessage
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.agent_messages.worker_task_blocked_message import WorkerTaskBlockedMessage
from suites.coding.modules.workers.support.work_units import UNIT_TASKS_REASON
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.agent_messages.worker_task_started_message import WorkerTaskStartedMessage
from core.modules.agents.support.agent_number_messages import AgentNumberMessages

HELP_COMMAND_TEXT = AskTopic.GENERAL.question_line()


class WorkerUnitStop:
    """Whether a worker's stop is held: it may stop with no task, at a point of its round that waits, while a
    run or a helper of its own continues, while a reader is needed, or between tasks to be compacted; at a
    merge that is due, or else, it hears what to do now. With no task left it is told of each task of its that
    is blocked."""

    def __init__(self, tasks: TaskQuery, processes: ProcessQuery, requests: ReaderRequestQuery, clock: Clock, agents: AgentRows, compaction: WorkerCompaction,
                 guidance: WorkerGuidance, numbers: RowNumbers, request_values: RequestValues) -> None:
        self.tasks, self.processes, self.requests, self.clock, self.agents = tasks, processes, requests, clock, agents
        self.compaction, self.guidance, self.numbers, self.request_values = compaction, guidance, numbers, request_values

    # the text that holds the worker's stop now, or nothing when it may stop
    def refusal(self, agent_id: int) -> str | None:
        return self.answer(agent_id).refusal

    def blocked_lines(self, agent_id: int) -> list[AgentMessage]:
        return list(self.answer(agent_id).blocked_lines)

    # read once a request: the stop's need and its lines of one step ask the same rows
    def answer(self, agent_id: int) -> WorkerUnitStopAnswer:
        return self.request_values.read(f"workers.unit-stop:{agent_id}", lambda: 0, lambda: self.answered(agent_id))

    def answered(self, agent_id: int) -> WorkerUnitStopAnswer:
        if self.compaction.is_after_task(agent_id) or self.requests.has_active_requests(agent_id, self.clock.timestamp()):
            return WorkerUnitStopAnswer(None, ())
        point = self.guidance.point(agent_id)
        if point.step is WorkerStep.MERGE_DUE:
            return WorkerUnitStopAnswer(WorkerTaskStartedMessage.declared().agent_message(line=point.line).text, ())
        if not point.round.started and point.round.following is None:
            blocked = self.tasks.assignee_tasks(agent_id).filter(state=TaskState.BLOCKED).every_row(UNIT_TASKS_REASON)
            return WorkerUnitStopAnswer(None, tuple(AgentNumberMessages.message(self.numbers, WorkerTaskBlockedMessage, "worker", agent_id, task=row.id) for row in blocked))
        if point.step.may_stop() or self.processes.agent(agent_id).running().exists() or self.agents.running_with_read_access(agent_id):
            return WorkerUnitStopAnswer(None, ())
        return WorkerUnitStopAnswer(WorkerTaskStartedMessage.declared().agent_message(line=f"{point.line} {HELP_COMMAND_TEXT}").text, ())
