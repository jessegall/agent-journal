from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.drivers.commands.report_compaction_faults.report_compaction_faults import ReportCompactionFaults


class CompactionFaultsTick:
    """Reports the compactions that went wrong, on a tick of its own, so it runs with no agent alive to carry it."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(ReportCompactionFaults(), Actor.core())
