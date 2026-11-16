from engine.agent_machine.contracts.policy import Policy
from core.modules.processes.policies.archive import Archive


class ArchivePolicy(Policy):
    key = "samples.archive"

    def __init__(self, archive: Archive) -> None:
        self.archive = archive

    def refusals(self, question, view):
        # @righteous architecture_processes_output_measured_outside_output_facts
        return self.archive.total_bytes(question.name)
