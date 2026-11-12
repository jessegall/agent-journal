from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plans.commands.record_plan_agent.record_plan_agent import RecordPlanAgent
from core.modules.plans.models.plan import Plan
from core.modules.assignments.support.assignments import Assignments


class RecordPlanAgentHandler(Handler[RecordPlanAgent, Plan]):
    """Assigns a plan to its agent without its phases and tasks; a person or a main agent names it."""

    command = RecordPlanAgent

    def __init__(self, rows: EventRows, agents: AgentRows, assignments: Assignments) -> None:
        self.rows, self.agents, self.assignments = rows, agents, assignments

    def handle(self, command: RecordPlanAgent, context: Context) -> Plan:
        self.agents.require_main(context.actor, "name the agent of a plan")
        plan = self.rows.required(Plan, command.plan_id)
        self.assignments.assign_kept(plan, command.agent_id, context, cascade=False)
        return plan
