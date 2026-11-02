from dataclasses import replace

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
from core.modules.processes.support.process_nudges import REQUIRED_MONITOR


class BackgroundRunWatchListener(SaveListener):
    """A run moved to the background is watched by the agent that started it, so it hears how the run goes. An
    agent whose program has a Monitor tool is held until it sets one on a run it started itself."""

    name = "processes.background-run-watch"
    event = "process.*"

    def __init__(self, repository: Repository, bus: Bus, queries: Queries, providers: Providers) -> None:
        self.repository, self.bus, self.queries, self.providers = repository, bus, queries, providers

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if isinstance(process, Process) and change.move is not None and change.move.name == "background":
            self.repository.save(Watch(agent_id=process.agent_id, process_id=process.id, creator_id=process.agent_id, given_percent=UNANNOUNCED_PERCENT), change.context)
            if self.needs_monitor(process):
                nudge = REQUIRED_MONITOR.nudge(output=process.id)
                self.bus.dispatch(BlockUntil(process.agent_id, replace(nudge, key=f"{nudge.key}.{process.id}"), OutputMonitored(process.id)), change.context)

    def needs_monitor(self, process: Process) -> bool:
        program = self.queries.query(Agent).find(process.agent_id).program
        return process.creator_id == process.agent_id and ToolType.MONITOR in self.providers.provider(program).tool_categories.values()
