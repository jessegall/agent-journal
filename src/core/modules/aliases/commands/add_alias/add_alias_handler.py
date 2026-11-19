from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.aliases.commands.add_alias.add_alias import AddAlias
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_readers import AliasReaders
from core.modules.aliases.support.saved_command_conflicts import SavedCommandConflicts


class AddAliasHandler(Handler[AddAlias, Alias]):
    """Saves a new alias once its name is free and its reader exists."""

    command = AddAlias

    def __init__(self, repository: Repository, names: AliasNames, readers: AliasReaders, conflicts: SavedCommandConflicts) -> None:
        self.repository, self.names, self.readers, self.conflicts = repository, names, readers, conflicts

    def handle(self, command: AddAlias, context: Context) -> Alias:
        self.names.check_free(command.name)
        alias = Alias(creator_id=context.actor.id, name=command.name, line=command.line, reader_id=self.readers.reader_id(command.reader_name),
                      description=command.description, variables=command.variables, background=command.background,
                      agent_access=command.agent_access, category=command.category)
        self.conflicts.refuse(alias, None, context)
        return self.repository.save(alias, context)
