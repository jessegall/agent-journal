from dataclasses import asdict

from engine.command.context import Context
from engine.library.library_share import Fields, LibraryShare
from engine.repository.repository import Repository
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.support.check_columns import CheckColumns


class CheckLibraryShare(LibraryShare[Check]):
    """A check is sent as its title, command, brief and interval; its results stay here. It arrives
    stopped, since its command runs on this computer. While it is started, a changed command waits for a
    person, and the command that user read goes on running."""

    name = "check"
    model = Check

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def fields(self, row: Check) -> Fields:
        return {"title": row.title, "command": row.command, "brief": row.brief, "interval_minutes": row.interval_minutes}

    def arrive(self, fields: Fields, context: Context) -> Check:
        return self.repository.save(Check(creator_id=context.actor.id, stopped=True, **asdict(CheckColumns.parsed(fields))), context)

    def follow(self, row: Check, fields: Fields, context: Context) -> Check:
        return self.repository.update(row, context, **asdict(CheckColumns.parsed(fields)))

    def is_removed(self, row: Check) -> bool:
        return row.removed_at is not None

    def needs_reading(self, row: Check, fields: Fields) -> str:
        return "The command of this check changed." if row.is_running and fields["command"] != row.command else ""

    def warning(self, fields: Fields) -> str:
        return f"this check runs on your computer: {fields['command']}"

    def share_refusal(self, row: Check) -> str:
        return "this check belongs to a task's wait" if row.task_wait_id is not None or row.hidden else ""
