from journal.events.listener import Listener
from journal.events.models.saving import Saving
from journal.models.link import Link
from journal.support.refused import Refused
from journal.repositories.tasks import WAIT_LINK, Tasks


class NoWaitCycles(Listener[Saving]):
    """A wait that would close a loop is refused, whoever writes it: if A waits on B and B on A, neither could ever start."""

    def __init__(self, tasks: Tasks) -> None:
        self.tasks = tasks

    def handle(self, event: Saving) -> None:
        link = event.model
        if not isinstance(link, Link) or link.kind != WAIT_LINK:
            return
        if self.tasks.waits_reach(link.target, link.source):
            raise Refused(f"{link.source} waiting on {link.target} would close a loop of waits that nothing could ever end")
