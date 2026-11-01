from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.aliases.commands.add_alias.add_alias import AddAlias
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_readers import AliasReaders


class AddAliasHandler(Handler[AddAlias, Alias]):
    """Saves a new alias once its name is free and its reader exists."""

    command = AddAlias

    def __init__(self, repository: Repository, names: AliasNames, readers: AliasReaders) -> None:
        self.repository, self.names, self.readers = repository, names, readers

    def handle(self, command: AddAlias, context: Context) -> Alias:
        self.names.check_free(command.name)
        return self.repository.save(Alias(creator_id=context.actor.id, name=command.name, line=command.line, reader_id=self.readers.reader_id(command.reader_name),
                                          description=command.description, variables=command.variables, background=command.background,
                                          worker_access=command.worker_access), context)
