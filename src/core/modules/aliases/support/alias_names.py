from core.base.bookkeeping.bookkeeping_subcommands import BOOKKEEPING_SUBCOMMANDS
from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery

PROGRAM_COMMANDS = frozenset({"launch", "worktree", "server", "viewer", "claude", "codex"})


class AliasNames:
    """The names aliases go by: a name is free when no journal command and no other alias has it."""

    def __init__(self, aliases: AliasQuery, registry: Registry) -> None:
        self.aliases, self.registry = aliases, registry

    def command_names(self) -> frozenset[str]:
        command_lines = [*self.registry.subcommands, *BOOKKEEPING_SUBCOMMANDS]
        return frozenset({*self.registry.models, *(line.split(" ", 1)[0] for line in command_lines), *PROGRAM_COMMANDS})

    def is_free(self, name: str) -> bool:
        return name not in self.command_names() and not self.aliases.with_name(name).exists()

    def check_free(self, name: str) -> None:
        if name in self.command_names():
            raise Refusal(f"{name} is a journal command: pick another name")
        if self.aliases.with_name(name).exists():
            raise Refusal(f"the alias {name} exists: change it with journal alias edit {name}")

    def alias(self, name: str) -> Alias:
        alias = self.aliases.with_name(name).first()
        if alias is None:
            raise Refusal(f"no alias is called {name}", "journal alias list lists them")
        return alias
