from collections.abc import Sequence

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_class import UNLIMITED, ExecutionClass
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.enums.run_scope import RunScope
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.free_memory import FreeMemory
from core.modules.plugins.support.machine_runs import MachineRuns
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_run_admission import PluginRunAdmission
from core.modules.plugins.support.plugin_run_rule import PluginRunRule
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_type_limits import ProcessTypeLimits

PLUGIN_KIND_COST = 4
PLUGINS_REASON = "the limits of every plugin that has a run kind are read"


class PluginRunLimits(ProcessTypeLimits):
    """Holds a waiting run of a plugin's kind while as many runs of that kind hold a place as the plugin setting
    its manifest names, in this project or on the whole machine as the kind's scope says, or while the machine
    has less free memory than the kind asks for. Each plugin, manifest and count is read once for a pass."""

    def __init__(self, queries: Queries, folders: PluginFolders, settings: PluginSettings, machine: MachineRuns, memory: FreeMemory) -> None:
        self.queries, self.folders, self.settings, self.machine, self.memory = queries, folders, settings, machine, memory

    def admissions(self, waiting: Sequence[Process]) -> PluginRunAdmission:
        rules = self.rules(waiting)
        if not rules:
            return PluginRunAdmission({}, 0, {})
        needs_memory = any(rule.declared.memory_mb for rule in rules.values())
        machine = {(plugin, category): self.machine.count(plugin, category) for (plugin, category, _), rule in rules.items() if rule.declared.scope is RunScope.MACHINE}
        return PluginRunAdmission(rules, self.memory.megabytes() if needs_memory else 0, machine)

    # a plugin's kind runs in the long lane at normal, as many at once as its manifest's setting allows
    def kind_classes(self, waiting: Sequence[Process]) -> dict[tuple[str, str], ExecutionClass]:
        return {(plugin, category): ExecutionClass(f"{plugin} {category}", ExecutionLane.LONG, PLUGIN_KIND_COST, ExecutionPriority.NORMAL,
                                                   rule.limit if rule.limit is not None else UNLIMITED, plugin=plugin)
                for (plugin, category, _), rule in self.rules(waiting).items()}

    def rules(self, waiting: Sequence[Process]) -> dict[tuple[str, str, int], PluginRunRule]:
        categories = {(process.plugin, process.run_name, process.environment_id) for process in waiting if process.plugin and process.run_name}
        if not categories:
            return {}
        plugins = {plugin.name: plugin for plugin in self.queries.query(Plugin).matching(Among("name", sorted({plugin for plugin, _, _ in categories}))).every_row(PLUGINS_REASON)}
        environments = {environment.id: environment.name for environment in self.queries.query(Environment).find_many(sorted({environment for _, _, environment in categories}))}
        manifests = {name: PluginManifest.read(self.folders.code(name)) for name in plugins}
        values = {(plugin, environment): self.settings.values(plugins[plugin], manifests[plugin], environments[environment])
                  for plugin, _, environment in categories if plugin in plugins}
        rules: dict[tuple[str, str, int], PluginRunRule] = {}
        for plugin, category, environment in categories:
            declared = manifests[plugin].process_category(category) if plugin in manifests else None
            if declared is None:
                continue
            limit = values[(plugin, environment)].get(declared.concurrent_setting)
            rules[(plugin, category, environment)] = PluginRunRule(declared, limit if isinstance(limit, int) and limit > 0 else None)
        return rules
