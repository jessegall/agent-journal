from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.enums.run_scope import RunScope
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.free_memory import FreeMemory
from core.modules.plugins.support.machine_runs import MachineRuns
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_kind_pass import KindRule, PluginKindPass
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_kind_limits import ProcessKindLimits

PLUGINS_REASON = "the limits of every plugin that has a run kind are read"


class PluginProcessKindLimits(ProcessKindLimits):
    """Holds a waiting run of a plugin's kind while as many runs of that kind hold a place as the plugin setting
    its manifest names, in this project or on the whole machine as the kind's scope says, or while the machine
    has less free memory than the kind asks for. Each plugin, manifest and count is read once for a pass."""

    def __init__(self, queries: Queries, folders: PluginFolders, settings: PluginSettings, machine: MachineRuns, memory: FreeMemory) -> None:
        self.queries, self.folders, self.settings, self.machine, self.memory = queries, folders, settings, machine, memory

    def pass_over(self, waiting: Sequence[Process]) -> PluginKindPass:
        kinds = {(process.plugin, process.kind, process.environment_id) for process in waiting if process.plugin and process.kind}
        if not kinds:
            return PluginKindPass({}, 0, {})
        plugins = {plugin.name: plugin for plugin in self.queries.query(Plugin).matching(Among("name", sorted({plugin for plugin, _, _ in kinds}))).every_row(PLUGINS_REASON)}
        environments = {environment.id: environment.name for environment in self.queries.query(Environment).find_many(sorted({environment for _, _, environment in kinds}))}
        manifests = {name: PluginManifest.read(self.folders.code(name)) for name in plugins}
        values = {(plugin, environment): self.settings.values(plugins[plugin], manifests[plugin], environments[environment])
                  for plugin, _, environment in kinds if plugin in plugins}
        rules: dict[tuple[str, str, int], KindRule] = {}
        for plugin, kind, environment in kinds:
            declared = manifests[plugin].process_kind(kind) if plugin in manifests else None
            if declared is None:
                continue
            limit = values[(plugin, environment)].get(declared.at_once_setting)
            rules[(plugin, kind, environment)] = KindRule(declared, limit if isinstance(limit, int) and limit > 0 else None)
        needs_memory = any(rule.declared.memory_mb for rule in rules.values())
        machine = {(plugin, kind): self.machine.count(plugin, kind) for (plugin, kind, _), rule in rules.items() if rule.declared.scope is RunScope.MACHINE}
        return PluginKindPass(rules, self.memory.megabytes() if needs_memory else 0, machine)
