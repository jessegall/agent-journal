from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.plugin_runner import PluginRunner
from journal.support.plugin_service import PluginService
from journal.models.plugin import Plugin
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink

CONDITION_TIMEOUT_SECONDS = 30


class PluginServices:
    """A plugin's services, each run by the environment's supervisor as plugin.<plugin>.<service> with the plugin's clean environment, where its when check passes; with no supervisor none runs, and the plugin's program answers instead."""

    def __init__(self, supervisor: SupervisorLink, runner: PluginRunner, folders: PluginFolders, environments: Environments) -> None:
        self.supervisor, self.runner, self.folders, self.environments = supervisor, runner, folders, environments

    def start(self, plugin: Plugin) -> list[str]:
        started = []
        for environment in self.environments.all():
            if not self.supervisor.runs(environment.id):
                continue
            for service in plugin.manifest.services:
                if service.when and self.runner.shell(plugin, environment.name, service.when, CONDITION_TIMEOUT_SECONDS).returncode != 0:
                    continue
                environ = self.runner.environment(plugin, environment.name) | {"JOURNAL_PLUGIN_SOCKET": str(self.folders.socket(plugin, environment.name))}
                folder = self.folders.of(plugin)
                command = [str(folder / service.program) if service.is_in_its_folder else service.program, *service.command[1:]]
                self.supervisor.start_clean(environment.id, self.named(plugin, service), command, folder, environ, self.folders.data(plugin) / f"{service.name}.log", service.restart != "never")
                started.append(self.named(plugin, service))
        return started

    def stop(self, plugin: Plugin) -> None:
        for environment in self.environments.all():
            if self.supervisor.runs(environment.id):
                for service in plugin.manifest.services:
                    self.supervisor.stop_service(environment.id, self.named(plugin, service))

    @staticmethod
    def named(plugin: Plugin, service: PluginService) -> str:
        return f"plugin.{plugin.name}.{service.name}"
