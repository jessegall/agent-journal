from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.caller.caller import Caller
from engine.query.conditions.among import Among
from core.modules.assignments.queries.conditions.assignee_among import AssigneeAmong
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.time.timestamp import Timestamp
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.plans.models.plan_card import PlanCard
from core.modules.plans.models.plan_task import PlanTask
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.usage.support.agent_inspection import AgentInspection
from core.modules.usage.support.agent_move import AgentMove
from core.modules.usage.support.agent_plan import AgentPlan
from core.modules.usage.support.agent_task import AgentTask

LATEST_MOVE_COUNT = 5
PERSON_NAME = "You"
UNLINKED_TABLE = ""
TASKS_TABLE = "tasks"
GOOD_TONE = "good"
BAD_TONE = "bad"
FAILED_RUN_TEXTS = {ProcessState.FAILED: "A run failed", ProcessState.STOPPED: "A run was stopped", ProcessState.ORPHANED: "A run was lost"}


class UsageAgentSubcommand(ReadSubcommand[AgentInspection]):
    """`journal usage agent <n>`: what the inspector of agent n shows beyond its row, in one read."""

    cli_name = "usage"
    name = "agent"

    def __init__(self, queries: Queries, processes: ProcessQuery) -> None:
        self.queries, self.processes = queries, processes

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)

    def read(self, arguments: Namespace, caller: Caller) -> AgentInspection:
        agent = self.queries.query(Agent).find(arguments.agent_id)
        current_task = self.queries.query(Task).filter(holder_id=agent.id, state=TaskState.STARTED).first()
        starter_name, last_activity = self.starter_name(agent), self.last_activity(agent.id)
        failed_runs, recent = self.failed_run_query(agent.id).count(), self.recent_moves(agent.id)
        task = AgentTask(current_task.id, current_task.title) if current_task else None
        return AgentInspection(agent.id, starter_name, last_activity, failed_runs, recent, task, self.task_plan(current_task) if current_task else None)

    def starter_name(self, agent: Agent) -> str:
        starter = self.queries.query(ActorRecord).find(agent.creator_id)
        if starter.type is ActorType.USER:
            return PERSON_NAME
        if starter.type is not ActorType.AGENT:
            return starter.name
        parent = self.queries.query(Agent).find(starter.id)
        name = parent.display_name
        return f"{name}, the main agent" if parent.role == AgentRole.MAIN else name

    def last_activity(self, agent_id: int) -> str:
        latest = self.queries.query(HookCall).filter(session_agent_id=agent_id).newest().first()
        return latest.creation_timestamp().text if latest is not None else ""

    def failed_run_query(self, agent_id: int) -> ProcessQuery:
        return self.processes.agent(agent_id).matching(Among("state", tuple(FAILED_RUN_TEXTS))).matching(Greater("ended_at", ""))

    def recent_moves(self, agent_id: int) -> tuple[AgentMove, ...]:
        finished_tasks = self.queries.query(Task).filter(state=TaskState.COMPLETED).matching(AssigneeAmong(Task, tuple([agent_id]))).matching(Greater("closed_at", "")).descending("closed_at").take(LATEST_MOVE_COUNT)
        runs = self.failed_run_query(agent_id).descending("ended_at").take(LATEST_MOVE_COUNT)
        moves = (*(self.finished_task_move(task, task.closed_at) for task in finished_tasks if task.closed_at is not None),
                 *(self.failed_run_move(run, run.ended_at) for run in runs if run.ended_at is not None))
        return tuple(sorted(moves, key=lambda move: move.time, reverse=True)[:LATEST_MOVE_COUNT])

    @staticmethod
    def finished_task_move(task: Task, closed_at: Timestamp) -> AgentMove:
        return AgentMove(closed_at.text, f"Finished task {task.id}: {task.title}", GOOD_TONE, TASKS_TABLE, task.id)

    @staticmethod
    def failed_run_move(run: Process, ended_at: Timestamp) -> AgentMove:
        return AgentMove(ended_at.text, f"{FAILED_RUN_TEXTS[run.state]}: {run.line}", BAD_TONE, UNLINKED_TABLE, run.id)

    def task_plan(self, task: Task) -> AgentPlan | None:
        place = self.queries.query(PlanTask).filter(task_id=task.id).first()
        if place is None:
            return None
        card = self.queries.query(PlanCard).find(place.plan_id)
        return AgentPlan(card.id, card.title, card.current_phase, card.completed_count, card.task_count)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentInspection):
            output.write(f"started by {value.starter_name}, {value.failed_runs} failed runs", value.json())
