from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plans.commands.record_plan_agent.record_plan_agent import RecordPlanAgent
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_assignee import PlanAssignee


class RecordPlanAgentHandler(Handler[RecordPlanAgent, Plan]):
    """Writes the agent of a plan; a person or a main agent names it."""

    command = RecordPlanAgent

    def __init__(self, rows: EventRows, repository: Repository, agents: AgentRows) -> None:
        self.rows, self.repository, self.agents = rows, repository, agents

    def handle(self, command: RecordPlanAgent, context: Context) -> Plan:
        self.agents.require_main(context.actor, "name the agent of a plan")
        plan = self.rows.required(Plan, command.plan_id)
        return self.repository.save_metadata(plan, PlanAssignee.with_agent(plan, command.agent_id), context)
