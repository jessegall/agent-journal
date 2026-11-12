from engine.driver.driver_rule import DriverRule
from core.modules.processes.rules.archive import Archive


class ArchiveRule(DriverRule):
    name = "samples.archive"

    def __init__(self, archive: Archive) -> None:
        self.archive = archive

    def answer(self, hook):
        # @righteous architecture_processes_output_measured_outside_output_facts
        return self.archive.total_bytes(hook.name)
