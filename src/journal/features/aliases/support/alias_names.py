from journal.console.standard_commands import StandardCommands
from journal.features.registry import Registry
from journal.repositories.aliases import Aliases

SHIM_COMMANDS = ("claude", "codex", "serve")


class AliasNames:
    """Whether a name is free for an alias: the journal's own nouns, the words the shim runs itself and the aliases already kept are taken."""

    def __init__(self, registry: Registry, aliases: Aliases) -> None:
        self.registry, self.aliases = registry, aliases

    def refusal(self, name: str) -> str:
        nouns = {command.noun for feature in self.registry.features for command in feature.commands} | {command.noun for command in StandardCommands.COMMANDS} | set(SHIM_COMMANDS)
        if name in nouns:
            return f"{name} is a journal command: an alias takes a name of its own"
        if self.aliases.matching(name=name):
            return f"an alias named {name} exists: journal alias edit {name} changes it"
        return ""
