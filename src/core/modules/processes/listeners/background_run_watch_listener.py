from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.base.change.moved import Moved
from dataclasses import replace

from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.command.bus import Bus
from core.base.driver.block_until import BlockUntil
from core.base.driver.tool_type import ToolType
from core.base.listener.save_listener import SaveListener
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import UNANNOUNCED_PERCENT, Watch
from core.modules.processes.support.block_conditions.output_monitored import OutputMonitored
from core.modules.processes.support.process_nudges import REQUIRED_MONITOR, REQUIRED_MONITOR_COMMAND
from core.base.command.context import Context


class BackgroundRunWatchListener(SaveListener[Moved[Process]]):
    """Watches background runs and requires a monitor according to the suite's declared policy."""

    name = "processes.background-run-watch"
    moves = tuple([ProcessLifecycle.background])

    def __init__(self, repository: Repository, bus: Bus, queries: Queries, providers: Providers, suites: SuiteChoice) -> None:
        self.repository, self.bus, self.queries, self.providers = repository, bus, queries, providers
        self.suites = suites

    def handle(self, event: Moved[Process], context: Context) -> None:
        process = event.row
        self.repository.save(Watch(session_agent_id=process.session_agent_id, process_id=process.id, creator_id=process.session_agent_id, given_percent=UNANNOUNCED_PERCENT), context)
        monitor_tool = self.monitor_tool(process)
        if monitor_tool is not None:
            declaration = REQUIRED_MONITOR if monitor_tool is ToolType.MONITOR else REQUIRED_MONITOR_COMMAND
            nudge = declaration.nudge(output=process.id)
            self.bus.dispatch(BlockUntil(process.session_agent_id, replace(nudge, key=f"{nudge.key}.{process.id}"), OutputMonitored(process.id), blocks_stop=True), context)

    def monitor_tool(self, process: Process) -> ToolType | None:
        agent = self.queries.query(Agent).find(process.session_agent_id)
        if process.creator_id != process.session_agent_id or agent.role in self.suites.agent_policy().automatic_watch_roles:
            return None
        return self.providers.provider(agent.program).monitor_tool
