from core.modules.processes.commands.prune_processes.prune_processes import PruneProcesses
from core.modules.processes.events.output_ended import OutputEnded
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener


class ProcessPruneListener(CommitListener[OutputEnded]):
    """Prunes old processes after an ending run's end is saved, in a write of its own: pruning reads and deletes many
    rows and folders, which the run's end write must never wait on."""

    name = "processes.process-prune"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: OutputEnded, logged: LoggedEvent) -> None:
        self.bus.run(PruneProcesses(), Actor.core(), cause_id=logged.id, environment_id=logged.environment_id)
