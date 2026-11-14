from engine.helper_type.helper_type_book import HelperTypeBook
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker
from suites.coding.modules.workers.support.gone_agents import GoneAgents
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole
from core.modules.agents.support.agent_rows import AgentRows


class MissingProcessRule(DriverRule):
    """A tick ends each open helper of the environment whose recorded process is gone, though its end
    hook never came; one never seen stays."""

    name = "drivers.missing-process"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]

    def __init__(self, agents: AgentRows, missing_agents: GoneAgents, types: HelperTypeBook) -> None:
        self.agents, self.missing_agents, self.types = agents, missing_agents, types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        roles = self.types.helper_keys()
        agents = [agent for agent in self.agents.running() if agent.role in roles]
        missing = self.missing_agents.find(agents)
        return RuleAnswer.allowed().running(*(EndGoneWorker(agent.id) for agent in missing))
