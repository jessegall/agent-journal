from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.aliases.commands.remove_alias.remove_alias import RemoveAlias
from core.modules.aliases.support.alias_names import AliasNames


class RemoveAliasHandler(Handler[RemoveAlias, str]):
    """Deletes an alias and gives back its name."""

    command = RemoveAlias

    def __init__(self, repository: Repository, names: AliasNames) -> None:
        self.repository, self.names = repository, names

    def handle(self, command: RemoveAlias, context: Context) -> str:
        self.repository.delete(self.names.alias(command.name), context)
        return command.name
