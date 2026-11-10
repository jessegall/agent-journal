from engine.enums.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_assignee import PlanAssignee
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.tasks.models.enums.task_state import UNSTARTED_STATES
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from core.modules.tasks.support.task_assignees import TaskAssignees

ENDED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)


class AssignPlanHandler(Handler[AssignPlan, Plan]):
    """Keeps the agent a plan is assigned to on the plan and moves the open and blocked tasks of the plan or
    of one phase to it; with no agent named they are left free for the main agent to pick. A phase changes
    only its own tasks, never who the plan is assigned to. A person or a main agent may assign a plan, a
    helper may not."""

    command = AssignPlan

    def __init__(self, queries: Queries, repository: Repository, outlines: PlanOutlines, agents: AgentRows, assignees: TaskAssignees, waits: DependencyWaits) -> None:
        self.queries, self.repository, self.outlines, self.agents, self.assignees, self.waits = queries, repository, outlines, agents, assignees, waits

    def handle(self, command: AssignPlan, context: Context) -> Plan:
        self.agents.require_main(context.actor, "assign a plan")
        plan = self.queries.query(Plan).find(command.plan_id)
        if plan.state in ENDED_STATES:
            raise Refusal(f"plan {plan.id} is {plan.state.value}", "only a plan that is not finished is assigned")
        assignee = self.assignee(command)
        self.assignees.check_running(assignee)
        phases = self.outlines.outline(plan.id).chosen(command.phase_id)
        self.move_tasks(tuple(task.id for phase in phases for task in phase.tasks if task.state in UNSTARTED_STATES), assignee.id if command.agent_id is not None else None, context)
        if command.phase_id is not None:
            return plan
        return self.repository.save_metadata(plan, PlanAssignee.with_agent(plan, assignee.id), context)

    def move_tasks(self, task_ids: tuple[int, ...], agent_id: int | None, context: Context) -> None:
        if not task_ids:
            return
        for task in self.queries.query(Task).find_many(task_ids):
            self.repository.update(task, context, delegated_to=agent_id)
        self.waits.update_tasks(task_ids, context)

    def assignee(self, command: AssignPlan) -> Agent:
        if command.agent_id is not None:
            return self.agents.find(command.agent_id)
        main_agents = self.agents.running(AgentRole.MAIN)
        if not main_agents:
            raise Refusal("no main agent is running to take the plan", "name an agent with --to")
        return main_agents[0]
