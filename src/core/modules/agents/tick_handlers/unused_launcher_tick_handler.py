from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher import StopUnusedLauncher
from core.modules.agents.support.launcher_processes import LauncherProcesses


def stop_unused_launchers(container: Container) -> None:
    for serving, unused in container.get(LauncherProcesses).unused():
        container.get(Bus).run(StopUnusedLauncher(serving.pid, unused.pid), Actor.core())


class UnusedLauncherTickHandler(TickHandler):
    """Every minute, each second launcher of this journal that serves nobody is told to the user and stopped; the
    process table is read on a server thread, never inside a hook's write."""

    interval = TickInterval(seconds=60)
    handler = stop_unused_launchers
    name = "unused launchers"
