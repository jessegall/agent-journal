import json
from pathlib import Path

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.environments.models.environment import Environment
from suites.coding.models.file_edit import FileEdit
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit


EDITED = "edit"
NEW_FILE = "new"


class RecordFileEditHandler(Handler[RecordFileEdit, FileEdit]):
    """Saves the file edit of the agent's diff, its path named from the environment's folder when it is
    inside."""

    command = RecordFileEdit

    def __init__(self, repository: Repository, queries: Queries) -> None:
        self.repository, self.queries = repository, queries

    def relative_path(self, path: str, environment_id: int) -> str:
        folder = Path(self.queries.query(Environment).find(environment_id).folder)
        return str(Path(path).relative_to(folder)) if Path(path).is_relative_to(folder) else path

    def handle(self, command: RecordFileEdit, context: Context) -> FileEdit:
        return self.repository.save(FileEdit(session_agent_id=command.agent_id, creator_id=context.actor.id,
                                             path=self.relative_path(command.diff.path, context.required_environment_id()), added=command.diff.lines_added, removed=command.diff.lines_removed, rows=json.dumps(command.rows),
                                             edit_type=EDITED if command.diff.existed else NEW_FILE), context)
