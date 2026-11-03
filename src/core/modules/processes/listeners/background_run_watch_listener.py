from dataclasses import replace

from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.driver.block_until import BlockUntil
from core.base.driver.tool_type import ToolType
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import UNANNOUNCED_PERCENT, Watch
from core.modules.processes.support.block_conditions.output_monitored import OutputMonitored
from core.modules.processes.support.process_nudges import REQUIRED_MONITOR, REQUIRED_MONITOR_COMMAND


class BackgroundRunWatchListener(SaveListener):
    """A run moved to the background is watched by the agent that started it, so it hears how the run goes. A
    main agent whose program has a way to watch a run is held until it watches a run it started itself: it
    sets a Monitor on it, or runs journal output monitor in its shell when its program has no Monitor tool. A
    worker is never held: it hears of the end on its next hook, or is started again if it has stopped."""

    name = "processes.background-run-watch"
    event = "process.*"

    def __init__(self, repository: Repository, bus: Bus, queries: Queries, providers: Providers) -> None:
        self.repository, self.bus, self.queries, self.providers = repository, bus, queries, providers

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if isinstance(process, Process) and change.move is not None and change.move.name == "background":
            self.repository.save(Watch(agent_id=process.agent_id, process_id=process.id, creator_id=process.agent_id, given_percent=UNANNOUNCED_PERCENT), change.context)
            monitor_tool = self.monitor_tool(process)
            if monitor_tool is not None:
                declaration = REQUIRED_MONITOR if monitor_tool is ToolType.MONITOR else REQUIRED_MONITOR_COMMAND
                nudge = declaration.nudge(output=process.id)
                self.bus.dispatch(BlockUntil(process.agent_id, replace(nudge, key=f"{nudge.key}.{process.id}"), OutputMonitored(process.id)), change.context)

    def monitor_tool(self, process: Process) -> ToolType | None:
        agent = self.queries.query(Agent).find(process.agent_id)
        if process.creator_id != process.agent_id or agent.role is AgentRole.WORKER:
            return None
        return self.providers.provider(agent.program).monitor_tool
