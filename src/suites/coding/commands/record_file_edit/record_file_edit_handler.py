import json

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from suites.coding.models.file_edit import FileEdit
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit


EDITED = "edit"
NEW_FILE = "new"


class RecordFileEditHandler(Handler[RecordFileEdit, FileEdit]):
    """Saves the file edit of the agent's diff."""

    command = RecordFileEdit

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordFileEdit, context: Context) -> FileEdit:
        return self.repository.save(FileEdit(environment_id=command.environment_id, agent_id=command.agent_id, creator_id=context.actor.id,
                                             path=command.diff.path, added=command.diff.lines_added, removed=command.diff.lines_removed, rows=json.dumps(command.rows),
                                             edit_type=EDITED if command.diff.existed else NEW_FILE), context)
