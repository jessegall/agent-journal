from engine.enums.agent_role import AgentRole
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.assignments.support.assignments import Assignments
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.tasks.support.dependency_waits import DependencyWaits
from core.modules.tasks.support.task_assignees import TaskAssignees

ENDED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)


class AssignPlanHandler(Handler[AssignPlan, Plan]):
    """Gives a plan, or one of its phases, to the agent named, and through the cascade its phases and the tasks
    that have no assignee yet; with override also the tasks given to someone else. A phase is given on its own,
    never the plan. With no agent named the plan goes to the first running main agent and its tasks stay as
    they are. A person or a main agent may assign a plan, a helper may not."""

    command = AssignPlan

    def __init__(self, queries: Queries, outlines: PlanOutlines, agents: AgentRows, assignees: TaskAssignees, waits: DependencyWaits,
                 assignments: Assignments) -> None:
        self.queries, self.outlines, self.agents, self.assignees, self.waits = queries, outlines, agents, assignees, waits
        self.assignments = assignments

    def handle(self, command: AssignPlan, context: Context) -> Plan:
        self.agents.require_main(context.actor, "assign a plan")
        plan = self.queries.query(Plan).find(command.plan_id)
        if plan.state in ENDED_STATES:
            raise Refusal(f"plan {plan.id} is {plan.state.value}", "only a plan that is not finished is assigned")
        assignee = self.assignee(command)
        self.assignees.check_running(assignee)
        phases = self.outlines.outline(plan.id).chosen(command.phase_id)
        assigned = plan if command.phase_id is None else self.queries.query(Phase).find(command.phase_id)
        self.assignments.assign(assigned, assignee.id, context, cascade=command.agent_id is not None, override=command.override)
        self.waits.update_tasks([task.id for phase in phases for task in phase.tasks], context)
        return plan

    def assignee(self, command: AssignPlan) -> Agent:
        if command.agent_id is not None:
            return self.agents.find(command.agent_id)
        main_agents = self.agents.running(AgentRole.MAIN)
        if not main_agents:
            raise Refusal("no main agent is running to take the plan", "name an agent with --to")
        return main_agents[0]
