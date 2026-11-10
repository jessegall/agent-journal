from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.developer.commands.record_private_data_finding.record_private_data_finding import RecordPrivateDataFinding
from core.modules.developer.models.private_data_mark import PrivateDataMark


class RecordPrivateDataFindingHandler(Handler[RecordPrivateDataFinding, PrivateDataMark]):
    """Saves the row the chat shows its card from."""

    command = RecordPrivateDataFinding

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordPrivateDataFinding, context: Context) -> PrivateDataMark:
        return self.repository.save(PrivateDataMark(finding_key=command.finding_key, text=command.text), context)
