from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker
from suites.coding.modules.workers.support.gone_agents import GoneAgents
from suites.coding.modules.workers.types.worker import Worker


class MissingProcessEffect(EventEffect):
    """At a minute step of the main agent or a worker, ends each open helper of the environment whose recorded
    process is gone, though its end hook never came; one never seen stays."""

    key = "drivers.missing-process"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value, Worker.key]

    def __init__(self, agents: AgentRows, missing_agents: GoneAgents, types: HelperTypeBook) -> None:
        self.agents, self.missing_agents, self.types = agents, missing_agents, types

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        roles = self.types.helper_keys()
        running = self.agents.running()
        agents = [agent for agent in running if agent.role in roles]
        gone = self.missing_agents.find(agents)
        return [EndGoneWorker(agent.id) for agent in gone]
