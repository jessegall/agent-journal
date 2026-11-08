from collections.abc import Sequence

from core.base.agent_sandbox_choice import AgentSandboxChoice, SandboxedAgent
from core.base.helper_type_book import HelperTypeBook
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import MODULE_KEY, WORKER_SANDBOX

SANDBOX_KEY = "sandbox"


class WorkerSandboxChoice(AgentSandboxChoice):
    """A worker's choice on its agent row decides whether it is sandboxed, else the project setting."""

    def __init__(self, agents: AgentRows, types: HelperTypeBook, settings: SettingValues) -> None:
        self.agents, self.types, self.settings = agents, types, settings

    def sandboxed(self, agent_id: int) -> bool:
        return self.decided(self.agents.find(agent_id))

    def sandboxed_among(self, agents: Sequence[SandboxedAgent]) -> dict[int, bool]:
        return {agent.id: self.decided(agent) for agent in agents}

    def decided(self, agent: SandboxedAgent) -> bool:
        if not self.types.find(agent.role).separate_folder:
            return True
        choice = agent.metadata.module_part(MODULE_KEY)
        return bool(choice[SANDBOX_KEY]) if SANDBOX_KEY in choice else self.settings.flag(WORKER_SANDBOX)
