from collections.abc import Mapping, Sequence

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.classes.execution_class import UNLIMITED, ExecutionClass
from core.modules.plugins.models.enums.run_scope import RunScope
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_type_admission import ProcessTypeAdmission
from core.modules.plugins.support.plugin_run_rule import PluginRunRule


PLUGIN_KIND_COST = 4


class PluginRunAdmission(ProcessTypeAdmission):
    """The plugins' kinds of run for one pass of the queue: the rule of each kind waiting, the free memory and
    the runs of each machine-wide kind on the machine, read once; a run given its place in the pass counts at
    once, with the memory it asks for. Memory that is not known holds nothing back."""

    def __init__(self, rules: Mapping[tuple[str, str, int], PluginRunRule], free_megabytes: int | None, machine_counts: dict[tuple[str, str], int]) -> None:
        self.rules, self.free_megabytes, self.machine_counts = rules, free_megabytes, machine_counts

    def is_blocked(self, waiting: Process, running: Sequence[Process]) -> bool:
        rule = self.rules.get((waiting.plugin, waiting.run_name, waiting.environment_id))
        if rule is None:
            return False
        if self.free_megabytes is not None and self.free_megabytes < rule.declared.memory_mb:
            return True
        return rule.limit is not None and self.count(rule, waiting, running) >= rule.limit

    def count(self, rule: PluginRunRule, waiting: Process, running: Sequence[Process]) -> int:
        if rule.declared.scope is RunScope.MACHINE:
            return self.machine_counts[(waiting.plugin, waiting.run_name)]
        return sum((run.plugin, run.run_name) == (waiting.plugin, waiting.run_name) for run in running)

    def admitted(self, process: Process) -> None:
        rule = self.rules.get((process.plugin, process.run_name, process.environment_id))
        if rule is not None and self.free_megabytes is not None:
            self.free_megabytes -= rule.declared.memory_mb
        if (process.plugin, process.run_name) in self.machine_counts:
            self.machine_counts[(process.plugin, process.run_name)] += 1

    # a plugin's kind runs in the long lane at normal, as many at once as its manifest's setting allows
    def kind_classes(self) -> dict[tuple[str, str], ExecutionClass]:
        return {(plugin, category): ExecutionClass(f"{plugin} {category}", ExecutionLane.LONG, PLUGIN_KIND_COST, ExecutionPriority.NORMAL,
                                                   rule.limit if rule.limit is not None else UNLIMITED, plugin=plugin)
                for (plugin, category, _), rule in self.rules.items()}
