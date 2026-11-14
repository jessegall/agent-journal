from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from core.modules.plugins.support.orphan_services import OrphanServices
from core.modules.plugins.support.service_processes import ServiceProcesses


class OrphanServiceStopping:
    """Stops plugin service processes left running beside the ones the server supervises."""

    def __call__(self, container: Container) -> None:
        container.get(OrphanServices).stop(ServiceProcesses.shared(container.get(JournalHome)))
