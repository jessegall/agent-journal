from engine.actor.actor import CORE_ACTOR_ID
from engine.event.event_log import EventLog
from engine.time.clock import Clock
from engine.container.container import Container
from engine.database.database import Database
from engine.performance.performance_state import PerformanceState
from engine.process.plugin_script_processes import PluginScriptProcesses
from server.work.round_work import RoundWork


class BootingWork(RoundWork):
    """Stops stale scripts and records the server boot event."""

    def run(self, container: Container) -> None:
        container.get(PluginScriptProcesses).server_started()
        container.get(PluginScriptProcesses).stop_stale_processes()
        container.get(PerformanceState).begin_start()
        with container.get(Database).transaction():
            container.get(EventLog).write_journal_booting(CORE_ACTOR_ID, container.get(Clock).timestamp().text)
            container.get(PerformanceState).keep_boot_event(container.get(EventLog).newest_id())
