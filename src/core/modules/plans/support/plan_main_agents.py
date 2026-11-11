from engine.command.context import Context
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudger import Nudger
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_assignee import PlanAssignee


class PlanMainAgents:
    """Sends a line about a plan to the main agent that works it: the agent the plan is assigned to, else
    every main agent."""

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def send(self, plan: Plan, declaration: NudgeDeclaration, source: str, context: Context, **fields: object) -> None:
        assignee_id = PlanAssignee.agent_id(plan)
        for agent in MainAgentFinder.rows(self.queries):
            if assignee_id in (None, agent.id):
                self.nudger.send(agent.id, declaration, source, context, plan=plan.id, **fields)
