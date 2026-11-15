from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.driver.nudge import Nudge
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.nudges.worker_task_blocked_nudge import WorkerTaskBlockedNudge
from suites.coding.modules.workers.support.work_units import UNIT_TASKS_REASON
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.nudges.worker_task_started_nudge import WorkerTaskStartedNudge

HELP_COMMAND_TEXT = AskTopic.GENERAL.question_line()


class WorkerUnitStop:
    """Whether a worker's stop is held: it may stop with no task, at a point of its round that waits, while a run
    or a helper of its own continues, while a reader is needed, or between tasks to be compacted; at a merge that is
    due, or else, it hears what to do now. With no task left it is told of each task of its that is blocked."""

    def __init__(self, tasks: TaskQuery, processes: ProcessQuery, requests: ReaderRequestQuery, clock: Clock, agents: AgentRows, compaction: WorkerCompaction,
                 guidance: WorkerGuidance, numbers: RowNumbers) -> None:
        self.tasks, self.processes, self.requests, self.clock, self.agents = tasks, processes, requests, clock, agents
        self.compaction, self.guidance, self.numbers = compaction, guidance, numbers

    # the text that holds the worker's stop now, or nothing when it may stop
    def refusal(self, agent_id: int) -> str | None:
        if self.compaction.is_after_task(agent_id) or self.requests.has_active_requests(agent_id, self.clock.timestamp()):
            return None
        point = self.guidance.point(agent_id)
        if point.step is WorkerStep.MERGE_DUE:
            return WorkerTaskStartedNudge.declared().nudge(line=point.line).text
        has_task = bool(point.round.started) or point.round.following is not None
        if not has_task or point.step.may_stop():
            return None
        if self.processes.agent(agent_id).running().exists() or self.agents.running_with_read_access(agent_id):
            return None
        return WorkerTaskStartedNudge.declared().nudge(line=f"{point.line} {HELP_COMMAND_TEXT}").text

    def blocked_lines(self, agent_id: int) -> list[Nudge]:
        if self.compaction.is_after_task(agent_id) or self.requests.has_active_requests(agent_id, self.clock.timestamp()):
            return []
        point = self.guidance.point(agent_id)
        if point.step is WorkerStep.MERGE_DUE or point.round.started or point.round.following is not None:
            return []
        blocked = self.tasks.assignee_tasks(agent_id).filter(state=TaskState.BLOCKED).every_row(UNIT_TASKS_REASON)
        return [WorkerTaskBlockedNudge.declared().nudge(worker=self.numbers.number(AGENT_MODEL_NAME, agent_id), task=row.id) for row in blocked]
