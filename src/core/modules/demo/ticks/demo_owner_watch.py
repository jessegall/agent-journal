import os
import signal

from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from core.modules.demo.support.demo_owner import DemoOwner


class DemoOwnerWatch:
    """A demo's server stops itself once the process it was started for has ended; any other journal has no
    such process and goes on."""

    def __call__(self, container: Container) -> None:
        if DemoOwner(container.get(JournalHome).folder).has_ended():
            os.kill(os.getpid(), signal.SIGTERM)
