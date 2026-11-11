from core.modules.tasks.queries.task_query import TASK_PAGE_ROWS
from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.time.clock import Clock
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from suites.coding.support.coding_nudges import WORKER_TASK_STARTED
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction

HELP_COMMAND_TEXT = AskTopic.GENERAL.question_line()


class WorkerStopRule(DriverRule):
    """A worker may stop with no task, at a point of its round that waits, while a run or a helper of its own
    continues, while a reader is needed, or between tasks to be compacted. Otherwise it hears what to do now."""

    name = "workers.stop-once-delivered"
    hook = HookEventName.STOP
    drivers = ["coding.worker"]
    roles = [CodingHelperRole.WORKER]
    single_action_refusal = "A worker may stop with no task, at a point of its round that waits, while a run or a helper of its own"

    def __init__(self, tasks: TaskQuery, processes: ProcessQuery, requests: ReaderRequestQuery, clock: Clock, agents: AgentRows, compaction: WorkerCompaction, guidance: WorkerGuidance, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.compaction, self.guidance = compaction, guidance
        self.tasks, self.processes, self.requests, self.clock, self.agents = tasks, processes, requests, clock, agents

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.compaction.is_after_task(hook.agent_id):
            return RuleAnswer.allowed()
        worker_point = self.guidance.point(hook.agent_id)
        task = worker_point.round.started[0] if worker_point.round.started else worker_point.round.following
        if self.requests.has_active_requests(hook.agent_id, self.clock.timestamp()):
            return RuleAnswer.allowed()
        if task is None:
            blocked = self.tasks.assignee_tasks(hook.agent_id).filter(state=TaskState.BLOCKED).oldest().all_rows(TASK_PAGE_ROWS)
            return RuleAnswer.with_nudges(*(WORKER_TASK_BLOCKED.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, hook.agent_id), task=row.id) for row in blocked))
        if worker_point.step.may_stop():
            return RuleAnswer.allowed()
        if self.processes.agent(hook.agent_id).running().exists() or self.has_running_helper(hook.agent_id):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(WORKER_TASK_STARTED.nudge(line=f"{worker_point.line} {HELP_COMMAND_TEXT}"))

    def has_running_helper(self, agent_id: int) -> bool:
        return bool(self.agents.running(CodingHelperRole.HELPER, agent_id))
