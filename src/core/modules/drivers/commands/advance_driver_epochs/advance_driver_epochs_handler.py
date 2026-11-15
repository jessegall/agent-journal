from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.advance_driver_epochs.advance_driver_epochs import AdvanceDriverEpochs
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters


class AdvanceDriverEpochsHandler(Handler[AdvanceDriverEpochs, None]):
    """Moves every environment's driver epoch in one write and records when the journal started."""

    command = AdvanceDriverEpochs

    def __init__(self, writers: AnswerBasisWriters) -> None:
        self.writers = writers

    def handle(self, command: AdvanceDriverEpochs, context: Context) -> None:
        self.writers.record_journal_start(context)
