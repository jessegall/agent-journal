from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.aliases.commands.set_alias_silence.set_alias_silence import SetAliasSilence
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.support.alias_names import AliasNames


class SetAliasSilenceHandler(Handler[SetAliasSilence, Alias]):
    """Saves the alias with its silent mark set at this moment, or cleared together with the edit that fixed it."""

    command = SetAliasSilence

    def __init__(self, repository: Repository, names: AliasNames) -> None:
        self.repository, self.names = repository, names

    def handle(self, command: SetAliasSilence, context: Context) -> Alias:
        alias = self.names.alias(command.name)
        return self.repository.save(alias.changed(silent_at=context.timestamp if command.silent else None, fixed_at=None), context)
