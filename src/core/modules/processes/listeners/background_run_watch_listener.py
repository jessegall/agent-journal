from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from engine.event.moved import Moved
from dataclasses import replace

from engine.command.bus import Bus
from engine.driver.open_hold import OpenHold
from engine.enums.tool_type import ToolType
from engine.listener.save_listener import SaveListener
from engine.provider.providers import Providers
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import UNANNOUNCED_PERCENT, Watch
from core.modules.processes.support.block_conditions.output_monitored import OutputMonitored
from core.modules.processes.nudges.required_monitor_message import RequiredMonitorMessage
from core.modules.processes.nudges.required_monitor_command_message import RequiredMonitorCommandMessage
from engine.command.context import Context


class BackgroundRunWatchListener(SaveListener[Moved[Process]]):
    """Watches background runs and requires a monitor according to the suite's declared policy."""

    name = "processes.background-run-watch"
    moves = tuple([ProcessLifecycle.background])

    def __init__(self, repository: Repository, bus: Bus, queries: Queries, providers: Providers, types: HelperTypeBook) -> None:
        self.repository, self.bus, self.queries, self.providers = repository, bus, queries, providers
        self.types = types

    def handle(self, event: Moved[Process], context: Context) -> None:
        process = event.row
        self.repository.save(Watch(session_agent_id=process.session_agent_id, process_id=process.id, creator_id=process.session_agent_id, given_percent=UNANNOUNCED_PERCENT), context)
        monitor_tool = self.monitor_tool(process)
        if monitor_tool is not None:
            declaration = RequiredMonitorMessage.declared() if monitor_tool is ToolType.MONITOR else RequiredMonitorCommandMessage.declared()
            nudge = declaration.nudge(output=process.id)
            self.bus.dispatch(OpenHold(process.session_agent_id, replace(nudge, key=f"{nudge.key}.{process.id}"), OutputMonitored(process.id), blocks_stop=True), context)

    def monitor_tool(self, process: Process) -> ToolType | None:
        agent = self.queries.query(Agent).find(process.session_agent_id)
        if process.creator_id != process.session_agent_id or self.types.behaviours(agent.role).watches_runs_automatically:
            return None
        return self.providers.provider(agent.program).monitor_tool
