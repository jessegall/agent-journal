from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.plugins.models.enums.run_scope import RunScope
from core.modules.plugins.support.manifest_process_kind import ManifestProcessKind
from core.modules.processes.models.process import Process
from core.modules.processes.support.kind_pass import KindPass


@dataclass(frozen=True)
class KindRule:
    """A plugin's kind of run as one environment holds it: what the manifest declares and how many may run at once,
    none for no limit."""

    declared: ManifestProcessKind
    limit: int | None


class PluginKindPass(KindPass):
    """The plugins' kinds of run for one pass of the queue: the rule of each kind waiting, the free memory and the
    runs of each machine-wide kind on the machine, read once; a run given its place in the pass counts at once."""

    def __init__(self, rules: Mapping[tuple[str, str, int], KindRule], free_megabytes: int, machine_counts: dict[tuple[str, str], int]) -> None:
        self.rules, self.free_megabytes, self.machine_counts = rules, free_megabytes, machine_counts

    def is_held(self, waiting: Process, running: Sequence[Process]) -> bool:
        rule = self.rules.get((waiting.plugin, waiting.kind, waiting.environment_id))
        if rule is None:
            return False
        if self.free_megabytes < rule.declared.memory_mb:
            return True
        return rule.limit is not None and self.count(rule, waiting, running) >= rule.limit

    def count(self, rule: KindRule, waiting: Process, running: Sequence[Process]) -> int:
        if rule.declared.scope is RunScope.MACHINE:
            return self.machine_counts[(waiting.plugin, waiting.kind)]
        return sum((run.plugin, run.kind) == (waiting.plugin, waiting.kind) for run in running)

    def admitted(self, process: Process) -> None:
        if (process.plugin, process.kind) in self.machine_counts:
            self.machine_counts[(process.plugin, process.kind)] += 1
