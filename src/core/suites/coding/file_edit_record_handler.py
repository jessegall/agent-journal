from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.suites.coding.file_edit import FileEdit
from core.suites.coding.file_edit_record import FileEditRecord


class FileEditRecordHandler(Handler[FileEditRecord, FileEdit]):
    """Saves the file edit of the agent's diff."""

    command = FileEditRecord

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: FileEditRecord, context: Context) -> FileEdit:
        return self.repository.save(FileEdit(environment_id=command.environment_id, agent_id=command.agent_id, creator_id=context.actor.id,
                                             path=command.diff.path, added=command.diff.lines_added, removed=command.diff.lines_removed), context)
