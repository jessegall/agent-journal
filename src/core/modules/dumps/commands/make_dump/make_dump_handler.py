from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.dumps.commands.make_dump.make_dump import MakeDump
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem


class MakeDumpHandler(Handler[MakeDump, Dump]):
    """Saves a dump and its items, numbered from 1."""

    command = MakeDump

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakeDump, context: Context) -> Dump:
        if not command.brief.strip():
            raise Refusal("a dump needs something in it", "give the notes as the first argument")
        dump = self.repository.save(Dump(creator_id=context.actor.id, brief=command.brief, files=command.files), context)
        for position, text in enumerate([*(command.parts or [command.brief]), *sorted(command.files)], 1):
            self.repository.save(DumpItem(dump_id=dump.id, creator_id=context.actor.id, position=position, text=text), context)
        return dump

