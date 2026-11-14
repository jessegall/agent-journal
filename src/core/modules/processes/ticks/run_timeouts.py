from engine.actor.actor import Actor
from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.processes.commands.stop_timed_process.stop_timed_process import StopTimedProcess
from core.modules.processes.support.run_slots import RunSlots


class RunTimeouts:
    """Stops running commands whose duration limit has passed, from the kept read of running runs, so an idle
    journal asks nothing."""

    def __call__(self, container: Container) -> bool:
        timestamp = container.get(Clock).timestamp()
        running = [process for process in container.get(RunSlots).running() if process.timeout_seconds is not None]
        expired = [process for process in running if process.has_expired_timeout(timestamp)]
        for process in expired:
            container.get(Bus).run(StopTimedProcess(process.id), Actor.core(), environment_id=process.environment_id)
        return bool(expired)
