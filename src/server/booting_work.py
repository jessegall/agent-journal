from engine.actor.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from engine.time.clock import Clock
from engine.container.container import Container
from core.base.database.database import Database
from core.base.performance.performance_state import PerformanceState
from core.base.plugin_script_processes import PluginScriptProcesses
from server.round_work import RoundWork


class BootingWork(RoundWork):
    """Stops stale scripts and records the server boot event."""

    def run(self, container: Container) -> None:
        container.get(PluginScriptProcesses).server_started()
        container.get(PluginScriptProcesses).stop_stale_processes()
        container.get(PerformanceState).begin_start()
        with container.get(Database).transaction():
            container.get(EventLog).write_journal_booting(CORE_ACTOR_ID, container.get(Clock).timestamp().text)
            container.get(PerformanceState).keep_boot_event(container.get(EventLog).newest_id())
