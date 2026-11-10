from engine.actor.actor import Actor
from engine.time.clock import Clock
from core.base.command.bus import Bus
from engine.container.container import Container
from engine.query.conditions.has_value import HasValue
from core.modules.processes.commands.stop_timed_process.stop_timed_process import StopTimedProcess
from core.modules.processes.queries.process_query import ProcessQuery


class RunTimeouts:
    """Stops running commands whose duration limit has passed."""

    def __call__(self, container: Container) -> bool:
        timestamp = container.get(Clock).timestamp()
        running = tuple(container.get(ProcessQuery).running().matching(HasValue("timeout_seconds")).all_rows())
        expired = [process for process in running if process.has_expired_timeout(timestamp)]
        for process in expired:
            container.get(Bus).run(StopTimedProcess(process.id), Actor.core(), environment_id=process.environment_id)
        return bool(expired)
