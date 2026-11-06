from core.base.agent_type_book import AgentTypeBook
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker
from suites.coding.modules.workers.support.gone_agents import GoneAgents
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.modules.agents.support.agent_rows import AgentRows


class MissingProcessRule(DriverRule):
    """A tick ends each open worker or helper of the environment whose recorded process is gone, though its end
    hook never came; one never seen stays."""

    name = "drivers.missing-process"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, agents: AgentRows, missing_agents: GoneAgents, types: AgentTypeBook) -> None:
        self.agents, self.missing_agents, self.types = agents, missing_agents, types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        roles = self.types.derived_types("helper")
        agents = [agent for agent in self.agents.running() if agent.role in roles]
        missing = self.missing_agents.find(agents)
        return RuleAnswer.allowed().running(*(EndGoneWorker(agent.id) for agent in missing))
