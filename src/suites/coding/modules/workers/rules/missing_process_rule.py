from core.base.agent_type_book import AgentTypeBook
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker
from suites.coding.modules.workers.support.gone_agents import GoneAgents
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class MissingProcessRule(DriverRule):
    """A tick ends each open worker or helper of the environment whose recorded process is gone, though its end
    hook never came; one never seen stays."""

    name = "drivers.missing-process"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, queries: Queries, missing_agents: GoneAgents, types: AgentTypeBook) -> None:
        self.queries, self.missing_agents, self.types = queries, missing_agents, types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        agents = self.queries.query(Agent).matching(Among("role", self.types.derived_types("helper"))).matching(IsNull("ended_at")).all_rows()
        return RuleAnswer.allowed().running(*(EndGoneWorker(agent.id) for agent in self.missing_agents.find(agents)))
