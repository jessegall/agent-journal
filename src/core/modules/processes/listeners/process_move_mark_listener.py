from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from core.modules.processes.listeners.process_mark_listener import ProcessMarkListener
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process


class ProcessMoveMarkListener(ProcessMarkListener[Moved[Process]]):
    """A run that moves to the background is shown at the move: one that was not visible before it moved gets its
    mark then, and one that was gets its mark updated in place."""

    name = "processes.move-mark"
    moves = tuple([ProcessLifecycle.background])

    def handle(self, event: Moved[Process], logged: LoggedEvent) -> None:
        self.show(event.row, logged)
