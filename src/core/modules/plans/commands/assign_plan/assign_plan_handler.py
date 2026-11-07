from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_assignee import PlanAssignee
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.models.enums.task_state import TaskState

ENDED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)


class AssignPlanHandler(Handler[AssignPlan, Plan]):
    """Keeps the agent a plan is assigned to on the plan and moves the plan's open tasks to it, taking them
    from the agent that held them; a person or a main agent may assign a plan, a worker or helper may not."""

    command = AssignPlan

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, outlines: PlanOutlines, agents: AgentRows) -> None:
        self.queries, self.repository, self.bus, self.outlines, self.agents = queries, repository, bus, outlines, agents

    def handle(self, command: AssignPlan, context: Context) -> Plan:
        self.check_caller(context)
        plan = self.queries.query(Plan).find(command.plan_id)
        if plan.state in ENDED_STATES:
            raise Refusal(f"plan {plan.id} is {plan.state.value}", "only a plan that is not finished is assigned")
        assignee = self.assignee(command)
        for phase in self.outlines.outline(plan.id).phases:
            for task in phase.tasks:
                if task.state == TaskState.OPEN.value:
                    self.bus.run_with_context(AssignTask(task.id, assignee.id), context)
        return self.repository.save_metadata(plan, PlanAssignee.with_agent(plan, assignee.id), context)

    def assignee(self, command: AssignPlan) -> Agent:
        if command.worker_id is not None:
            return self.agents.find(command.worker_id)
        main_agents = self.agents.running(AgentRole.MAIN)
        if not main_agents:
            raise Refusal("no main agent is running to take the plan", "name a worker with --worker")
        return main_agents[0]

    def check_caller(self, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        caller = self.agents.find(context.actor.id)
        if caller.role != AgentRole.MAIN:
            raise Refusal(f"a {caller.role} cannot assign a plan", "ask the main agent or a person")
