from engine.enums.agent_role import AgentRole
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.assignments.support.assignments import Assignments
from core.modules.assignments.support.cascade import Cascade
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.tasks.support.dependency_waits import DependencyWaits
from core.modules.tasks.support.task_assignees import TaskAssignees

ENDED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)
PLAN_PHASES_REASON = "a plan given to an agent takes its phases from their former holders"


class AssignPlanHandler(Handler[AssignPlan, Cascade]):
    """Gives a plan, or one of its phases, to the agent named, and through the cascade its phases and the tasks
    that have no assignee yet; with override also the tasks given to someone else. A phase is given on its
    own, never the plan. With no agent named the plan goes to the first running main agent and its tasks stay
    as they are. The agent named takes the plan, and its phases, or the phase, in place of whoever held them, so
    their new tasks follow the new holder. A user or a main agent may assign a plan, a helper may not."""

    command = AssignPlan

    def __init__(self, queries: Queries, outlines: PlanOutlines, agents: AgentRows, assignees: TaskAssignees, waits: DependencyWaits,
                 assignments: Assignments) -> None:
        self.queries, self.outlines, self.agents, self.assignees, self.waits = queries, outlines, agents, assignees, waits
        self.assignments = assignments

    def handle(self, command: AssignPlan, context: Context) -> Cascade:
        self.agents.require_main(context.actor, "assign a plan")
        plan = self.queries.query(Plan).find(command.plan_id)
        if plan.state in ENDED_STATES:
            raise Refusal(f"plan {plan.id} is {plan.state.value}", "only a plan that is not finished is assigned")
        assignee = self.assignee(command)
        self.assignees.check_running(assignee)
        phases = self.outlines.outline(plan.id).chosen(command.phase_id)
        assigned = plan if command.phase_id is None else self.queries.query(Phase).find(command.phase_id)
        held = (assigned,) if command.phase_id is not None or command.agent_id is None else (plan, *self.queries.query(Phase).filter(plan_id=plan.id).every_row(PLAN_PHASES_REASON))
        for row in held:
            self.replace_holders(row, assignee.id, context)
        outcome = self.assignments.assign(assigned, assignee.id, context, cascade=command.agent_id is not None, override=command.override)
        self.waits.update_tasks([task.id for phase in phases for task in phase.tasks], context)
        return outcome

    def replace_holders(self, row: Plan | Phase, assignee_id: int, context: Context) -> None:
        for holder in self.assignments.actors(row):
            if holder != assignee_id:
                self.assignments.unassign(row, context, holder)

    def assignee(self, command: AssignPlan) -> Agent:
        if command.agent_id is not None:
            return self.agents.find(command.agent_id)
        main_agents = self.agents.running(AgentRole.MAIN)
        if not main_agents:
            raise Refusal("no main agent is running to take the plan", "name an agent with --to")
        return main_agents[0]
