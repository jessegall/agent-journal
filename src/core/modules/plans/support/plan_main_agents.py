from engine.command.context import Context
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudger import Nudger
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.plans.models.plan import Plan
from core.modules.assignments.support.assignments import Assignments


class PlanMainAgents:
    """Sends a line about a plan to the main agent that works it: the agent the plan is assigned to, else
    every main agent."""

    def __init__(self, queries: Queries, nudger: Nudger, assignments: Assignments) -> None:
        self.queries, self.nudger, self.assignments = queries, nudger, assignments

    def newest(self) -> Agent | None:
        return MainAgentFinder.newest(self.queries)

    def send(self, plan: Plan, declaration: NudgeDeclaration, source: str, context: Context, **fields: object) -> None:
        assignee_id = self.assignments.actor(plan)
        main_agents = tuple(MainAgentFinder.rows(self.queries))
        is_main_assignee = any(agent.id == assignee_id for agent in main_agents)
        for agent in main_agents:
            if not is_main_assignee or agent.id == assignee_id:
                self.nudger.send(agent.id, declaration, source, context, plan=plan.id, **fields)
