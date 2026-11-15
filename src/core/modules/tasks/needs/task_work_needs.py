from collections.abc import Mapping, Sequence

from engine.agent_stack.state_key import StateKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.work_reference import WorkReference
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.enums.decision_class import DecisionClass
from engine.enums.state_end import StateEnd
from engine.enums.work_type import WorkType
from engine.query.queries import Queries
from engine.driver.interval import Interval
from engine.driver.refusal_skips import RefusalSkips
from engine.driver.seconds import Seconds
from engine.time.clock import Clock
from engine.driver.watched_runs import WatchedRuns
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.nudges.stop_task_message import StopTaskMessage
from core.modules.tasks.nudges.stop_tasks_message import StopTasksMessage
from core.modules.tasks.support.current_tasks import CurrentTasks
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners

TASK_STOP_RULE = "tasks.carry-on-at-stop"
TASK_STOP_SKIP_WINDOW = Interval(ToolUseWindow(25), Seconds(1500))
# a Working frame is ordered by its push time, never by a rank key
TASK_RANK = ""
ENDED_TASKS_REASON = "the ended tasks whose frames one step takes off one agent's stack, a few at most"
TASK_ENDS = {TaskState.COMPLETED: StateEnd.CLOSED, TaskState.CANCELLED: StateEnd.CANCELLED}


class TaskWorkNeeds(StateSource):
    """One Working frame for each task a main agent holds started (doc 1310 section 4.4): work remains while it
    is started, unless the suite lets the agent stop with its tasks in hand; the stop text names every started
    task. A run going is the processes module's Waiting need on top."""
    state_type = Working
    rank = TASK_RANK
    agent_types = ["main"]

    def __init__(self, current_tasks: CurrentTasks, assigners: SuiteTaskAssigners, queries: Queries, runs: WatchedRuns, skips: RefusalSkips, clock: Clock, tasks: TaskQuery) -> None:
        self.current_tasks, self.assigners, self.queries, self.tasks = current_tasks, assigners, queries, tasks
        self.runs, self.skips, self.clock = runs, skips, clock

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        needs = {agent.agent_id: self.working(agent.agent_id) for agent in agents if agent.agent_type == "main"}
        return {agent_id: frames for agent_id, frames in needs.items() if frames}

    def working(self, agent_id: int) -> list[RequiredState | BlockPlan]:
        started = self.current_tasks.started_tasks(agent_id)
        if not started:
            return []
        remains = self.holds_stop(agent_id)
        reason = Reason(TASK_STOP_RULE, DecisionClass.HOLD, TASK_RANK, self.stop_text(started))
        return [RequiredState(Working(WorkReference(WorkType.TASK, task.id, f"task {task.id}"), remains, reason), TASK_RANK,
                     StateKey("Working", RowReference(Task.model_name, task.id), f"task:{task.id}")) for task in started]

    # the tasks in hand hold the agent's stop unless a run of its goes, its suite lets it stop with them, or it skipped
    # the stop refusal within the last 25 tool uses or 25 minutes, as today's tasks.carry-on-at-stop lets it
    def holds_stop(self, agent_id: int) -> bool:
        if self.runs.has_run(agent_id) or self.skips.is_skipped(agent_id, TASK_STOP_RULE, TASK_STOP_SKIP_WINDOW, self.clock.timestamp()):
            return False
        assigner = self.assigners.assigner()
        return assigner is None or not assigner.allows_stop_with_tasks(agent_id)

    # a task's frame leaves closed when the task completed and cancelled when it was cancelled, which is no progress
    def ends(self, subjects: Sequence[RowReference]) -> Mapping[RowReference, StateEnd]:
        task_ids = [subject.row_id for subject in subjects if subject.model == Task.model_name]
        tasks = self.tasks.named_tasks(task_ids)
        return {RowReference(Task.model_name, task.id): TASK_ENDS[task.state] for task in tasks if task.state in TASK_ENDS}

    @staticmethod
    def stop_text(started: Sequence[Task]) -> str:
        if len(started) > 1:
            return StopTasksMessage.declared().nudge(tasks=", ".join(f"task:{task.id}" for task in started)).text
        return StopTaskMessage.declared().nudge(task=started[0].id).text
