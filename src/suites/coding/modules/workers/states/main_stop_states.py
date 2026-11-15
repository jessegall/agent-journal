from collections.abc import Mapping, Sequence

from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass
from engine.enums.hook_event_name import HookEventName
from engine.enums.work_type import WorkType
from engine.time.clock import Clock
from suites.coding.modules.workers.support.available_work import AvailableWork
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.modules.workers.support.main_agent_work import MainAgentWork
from suites.coding.agent_messages.task_assignment_message import TaskAssignmentMessage
from suites.coding.agent_messages.unfinished_tasks_message import UnfinishedTasksMessage
from suites.coding.support.next_task import NextTask
from suites.coding.support.stop_notices import UNFINISHED_TASKS_TEXT, StopNotices

MAIN_STOP_KEY = "coding.main-stop"
# a Working stacked state is ordered by its push time, never by a rank key
MAIN_STOP_RANK = ""


class MainStopStates(StateSource):
    """A main agent's work at a stop (doc 1310 sections 4.11 and 10.5), none while it waits: with no task
    started and one it may act on, Working(handed task), whose always-effect starts it, at a stop and, while keep
    going is on, off a hook; with unfinished tasks of its own and none started, Working(own open tasks), whose stop is
    held once for each set of those tasks, unless the stop is the one that compacts its context; a started task holds
    the stop with its own stacked state."""
    state_type = Working
    rank = MAIN_STOP_RANK
    agent_types = ["main"]

    def __init__(self, work: AvailableWork, options: CodingMainOptions, unfinished_work: MainAgentWork, assigner: NextTask, notices: StopNotices, clock: Clock,
                 tasks: TaskQuery) -> None:
        self.work, self.options, self.unfinished_work, self.assigner, self.notices, self.clock = work, options, unfinished_work, assigner, notices, clock
        self.tasks = tasks

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        is_stop = question.event is not None and question.event.event is HookEventName.STOP
        if not is_stop and (question.event is not None or not self.options.options().continues_work):
            return {}
        states = {agent.agent_id: self.working(agent.agent_id, is_stop) for agent in agents if agent.agent_type == "main"}
        return {agent_id: stacked_states for agent_id, stacked_states in states.items() if stacked_states}

    def working(self, agent_id: int, is_stop: bool) -> list[RequiredState | BlockPlan]:
        if agent_id in self.unfinished_work.waiting_agents([agent_id], self.clock.timestamp()):
            return []
        handed = self.work.answer(agent_id).assigned_task
        if handed is not None:
            reason = Reason(MAIN_STOP_KEY, DecisionClass.HOLD, MAIN_STOP_RANK, TaskAssignmentMessage.declared().agent_message(task=handed.id).text)
            return [RequiredState(Working(WorkReference(WorkType.HANDED_TASK, handed.id, f"task {handed.id}"), True, reason), MAIN_STOP_RANK,
                         StateKey("Working", RowReference(Task.model_name, handed.id), f"handed-task:{handed.id}"))]
        return self.own_tasks(agent_id) if is_stop else []

    def own_tasks(self, agent_id: int) -> list[RequiredState | BlockPlan]:
        if self.work.is_stop_compacting(agent_id) or self.tasks.started_tasks(agent_id):
            return []
        task_ids = self.assigner.agent_tasks([agent_id]).get(agent_id, ())
        if not task_ids:
            return []
        text = UnfinishedTasksMessage.declared().agent_message(tasks=", ".join(str(task_id) for task_id in task_ids)).text
        remains = not self.notices.has_notice(agent_id, text, UNFINISHED_TASKS_TEXT)
        tasks = ",".join(str(task_id) for task_id in task_ids)
        return [RequiredState(Working(WorkReference(WorkType.OWN_TASKS, agent_id, f"tasks {tasks}"), remains, Reason(MAIN_STOP_KEY, DecisionClass.HOLD, MAIN_STOP_RANK, text)),
                     MAIN_STOP_RANK, StateKey("Working", RowReference(Agent.model_name, agent_id), f"own-tasks:{tasks}"))]
