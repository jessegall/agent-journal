from engine.actor.actor import Actor
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.modules.plugins.commands.change_plugin_service.change_plugin_service import ChangePluginService
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.service_processes import ServiceProcesses


class ChangePluginServiceHandler(Handler[ChangePluginService, str]):
    """Stops, starts or restarts one service in the set the server keeps, before the transaction because it
    waits on the processes; a stopped service stays stopped until it is started or the server starts anew."""

    command = ChangePluginService
    runs_once = True

    def __init__(self, home: JournalHome, runnable: RunnablePlugins, round: PluginServiceRound) -> None:
        self.home, self.runnable, self.round = home, runnable, round

    def prepare(self, command: ChangePluginService, actor: Actor) -> None:
        processes = ServiceProcesses.shared(self.home)
        if not processes.serving:
            raise Refusal("the journal's server keeps the services, and this process is not that server", "run the journal with its server started")
        if command.key not in self.service_keys():
            raise Refusal(f"plugin {command.plugin} has no running service {command.service}", "journal plugin services lists them")
        with processes.lock:
            if command.change.stops:
                processes.pause(command.key)
            if command.change.starts:
                processes.resume(command.key)
                self.round.run(processes)

    def service_keys(self) -> set[tuple[str, str]]:
        return {(runnable.plugin.name, service.name) for runnable in self.runnable.running() for service in runnable.manifest.services}

    def handle(self, command: ChangePluginService, context: Context) -> str:
        state = "running" if ServiceProcesses.shared(self.home).is_running(command.key) else "stopped"
        return f"{command.plugin} {command.service}: {state}"
