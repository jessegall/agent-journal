from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from core.modules.sequences.commands.save_standard_sequences.save_standard_sequences import SaveStandardSequences
from engine.event.file_publishing import FilePublishing


class StandardSequencesListener(CommitListener[FilePublishing]):
    """As the journal starts or an update changes its modules, writes the sequences it ships again."""

    name = "sequences.save-standard"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.bus.run(SaveStandardSequences(), Actor.core(), cause_id=logged.id)
