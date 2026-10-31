from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.environments.models.environment import Environment
from core.modules.dumps.commands.make_dump import MakeDump
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem


class MakeDumpHandler(Handler[MakeDump, Dump]):
    """Saves a dump and its items, numbered from 1."""

    command = MakeDump

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: MakeDump, context: Context) -> Dump:
        environment_id = context.environment_id or self.single_environment()
        if not command.brief.strip():
            raise Refusal("a dump needs something in it", "give the notes as the first argument")
        dump = self.repository.save(Dump(environment_id=environment_id, creator_id=context.actor.id, brief=command.brief, files=command.files), context)
        for position, text in enumerate([*(command.parts or [command.brief]), *sorted(command.files)], 1):
            self.repository.save(DumpItem(dump_id=dump.id, creator_id=context.actor.id, position=position, text=text), context)
        return dump

    def single_environment(self) -> int:
        environments = list(self.queries.query(Environment).all_rows())
        if len(environments) != 1:
            raise Refusal("a dump belongs to an environment", "add --environment <name>")
        return environments[0].id
