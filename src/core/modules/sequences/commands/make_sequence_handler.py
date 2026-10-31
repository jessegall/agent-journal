from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.sequences.commands.make_sequence import MakeSequence
from core.modules.sequences.models.sequence import Sequence


class MakeSequenceHandler(Handler[MakeSequence, Sequence]):
    """Saves a new sequence."""

    command = MakeSequence

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakeSequence, context: Context) -> Sequence:
        return self.repository.save(Sequence(creator_id=context.actor.id, title=command.title, steps=tuple(command.steps)), context)
