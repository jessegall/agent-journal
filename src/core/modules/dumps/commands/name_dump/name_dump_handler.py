from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.dumps.commands.name_dump.name_dump import NameDump
from core.modules.dumps.models.dump import Dump

DUMP_NAME_LIMIT_CHARACTERS = 80


class NameDumpHandler(Handler[NameDump, Dump]):
    """Gives an open dump its title."""

    command = NameDump

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: NameDump, context: Context) -> Dump:
        dump = self.rows.required(Dump, command.dump_id)
        if dump.closed_at is not None:
            raise Refusal(f"dump {dump.id} is closed", "a closed dump takes no more")
        if not 1 <= len(command.title) <= DUMP_NAME_LIMIT_CHARACTERS:
            raise Refusal(f"a dump's title is 1 to {DUMP_NAME_LIMIT_CHARACTERS} characters", "say it shorter")
        return self.repository.update(dump, context, title=command.title)
