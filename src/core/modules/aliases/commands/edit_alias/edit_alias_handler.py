from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.aliases.commands.edit_alias.edit_alias import EditAlias
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_readers import AliasReaders
from core.modules.aliases.support.saved_command_conflicts import SavedCommandConflicts


class EditAliasHandler(Handler[EditAlias, Alias]):
    """Saves an alias with the parts the command gives changed."""

    command = EditAlias

    def __init__(self, repository: Repository, names: AliasNames, readers: AliasReaders, conflicts: SavedCommandConflicts) -> None:
        self.repository, self.names, self.readers, self.conflicts = repository, names, readers, conflicts

    def handle(self, command: EditAlias, context: Context) -> Alias:
        alias = self.names.alias(command.name)
        reader_id = alias.reader_id if command.reader_name is None else self.readers.reader_id(command.reader_name)
        line = alias.line if command.line is None else command.line
        fixed_at = context.timestamp if alias.is_claimed and line != alias.line else alias.fixed_at
        changed = alias.changed(line=line, reader_id=reader_id,
                                description=alias.description if command.description is None else command.description,
                                background=alias.background if command.background is None else command.background,
                                agent_access=alias.agent_access if command.agent_access is None else command.agent_access,
                                category=command.category or alias.category, fixed_at=fixed_at)
        self.conflicts.refuse(changed, alias, context)
        return self.repository.save(changed, context)
