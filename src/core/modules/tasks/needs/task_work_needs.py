from collections.abc import Mapping, Sequence

from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.work_reference import WorkReference
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.enums.decision_class import DecisionClass
from engine.enums.frame_end import FrameEnd
from engine.enums.work_type import WorkType
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.nudges.stop_task_nudge import StopTaskNudge
from core.modules.tasks.nudges.stop_tasks_nudge import StopTasksNudge
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners

TASK_STOP_RULE = "tasks.carry-on-at-stop"
# a Working frame is ordered by its push time, never by a rank key
TASK_RANK = ""
TASK_SUBJECT = "task"
ENDED_TASKS_REASON = "the ended tasks whose frames one step takes off one agent's stack, a few at most"
TASK_ENDS = {TaskState.COMPLETED: FrameEnd.CLOSED, TaskState.CANCELLED: FrameEnd.CANCELLED}


class TaskWorkNeeds(NeedSource):
    """One Working frame for each task a main agent holds started (doc 1310 section 4.4): work remains while it
    is started, unless the suite lets the agent stop with its tasks in hand; the stop text names every started
    task, as today's tasks.carry-on-at-stop does. A run going is the processes module's Waiting need on top."""

    replaced_rules = tuple([TASK_STOP_RULE])
    state_type = Working
    rank = TASK_RANK
    agent_types = ["main"]

    def __init__(self, current_tasks: CurrentTasks, assigners: SuiteTaskAssigners, queries: Queries) -> None:
        self.current_tasks, self.assigners, self.queries = current_tasks, assigners, queries

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        needs = {agent.agent_id: self.working(agent.agent_id) for agent in agents if agent.agent_type == "main"}
        return {agent_id: frames for agent_id, frames in needs.items() if frames}

    def working(self, agent_id: int) -> list[Need | BlockPlan]:
        started = self.current_tasks.started_tasks(agent_id)
        if not started:
            return []
        assigner = self.assigners.assigner()
        remains = assigner is None or not assigner.allows_stop_with_tasks(agent_id)
        reason = Reason(TASK_STOP_RULE, DecisionClass.HOLD, TASK_RANK, self.stop_text(started))
        return [Need(Working(WorkReference(WorkType.TASK, task.id, f"task {task.id}"), remains, reason), TASK_RANK,
                     NeedKey("Working", SubjectReference(TASK_SUBJECT, task.id), f"task:{task.id}")) for task in started]

    # a task's frame leaves closed when the task completed and cancelled when it was cancelled, which is no progress
    def ends(self, subjects: Sequence[SubjectReference]) -> Mapping[SubjectReference, FrameEnd]:
        task_ids = [subject.row_id for subject in subjects if subject.model == TASK_SUBJECT]
        tasks = self.queries.query(Task).matching(Among("id", task_ids)).every_row(ENDED_TASKS_REASON) if task_ids else []
        return {SubjectReference(TASK_SUBJECT, task.id): TASK_ENDS[task.state] for task in tasks if task.state in TASK_ENDS}

    @staticmethod
    def stop_text(started: Sequence[Task]) -> str:
        if len(started) > 1:
            return StopTasksNudge.declared().nudge(tasks=", ".join(f"task:{task.id}" for task in started)).text
        return StopTaskNudge.declared().nudge(task=started[0].id).text
