from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.dumps.commands.name_dump import NameDump
from core.modules.dumps.models.dump import Dump

TITLE_LIMIT_CHARACTERS = 80


class NameDumpHandler(Handler[NameDump, Dump]):
    """Gives an open dump its title."""

    command = NameDump

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: NameDump, context: Context) -> Dump:
        dump = self.queries.query(Dump).find(command.dump_id)
        if dump.closed_at is not None:
            raise Refusal(f"dump {dump.id} is closed", "a closed dump takes no more")
        if not 1 <= len(command.title) <= TITLE_LIMIT_CHARACTERS:
            raise Refusal(f"a dump's title is 1 to {TITLE_LIMIT_CHARACTERS} characters", "say it shorter")
        return self.repository.save(replace(dump, title=command.title), context)
