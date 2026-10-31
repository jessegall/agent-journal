from core.base.cli.bookkeeping_subcommands import BOOKKEEPING_SUBCOMMANDS
from core.base.cli.default_subcommands import DefaultSubcommands, MoveSubcommand
from core.base.subcommand.subcommand import ReadSubcommand, Subcommand, is_subcommand_class
from core.base.command.command import Command
from core.base.container import Container
from core.base.model.model import Model
from core.base.registry.registry import Registry

AnySubcommand = Subcommand[Command[object], object] | ReadSubcommand[object]


class UsageError(Exception):
    """Raised when a command line names a noun or a subcommand the journal does not have."""


class SubcommandLookup:
    """Chooses the subcommand a command line asks for: a module's own when it wrote one, else the one the core
    builds for the noun; it imports that subcommand and nothing else."""

    def __init__(self, registry: Registry, container: Container, defaults: DefaultSubcommands) -> None:
        self.registry, self.container, self.defaults = registry, container, defaults

    def subcommand(self, cli_noun: str, name: str) -> AnySubcommand:
        bookkeeping = BOOKKEEPING_SUBCOMMANDS.get(f"{cli_noun} {name}")
        if bookkeeping is not None:
            return self.container.get(bookkeeping)
        module_subcommand = self.registry.subcommands.get(f"{cli_noun} {name}")
        if module_subcommand is not None:
            subcommand_class = module_subcommand.loaded()
            if is_subcommand_class(subcommand_class):
                return self.container.get(subcommand_class)
        entry = self.registry.nouns.get(cli_noun)
        if entry is None:
            raise UsageError(f"journal has no noun {cli_noun}: journal --help lists them")
        model = entry.model.loaded()
        if not issubclass(model, Model):
            raise UsageError(f"{entry.model.text} is no model")
        built = self.built(model, entry.commands, name)
        if built is None:
            raise UsageError(f"journal {cli_noun} has no subcommand {name}: journal {cli_noun} --help lists them")
        return built

    def built(self, model: type[Model], command_paths: tuple[str, ...], name: str) -> AnySubcommand | None:
        standard = {"make": self.defaults.make, "show": self.defaults.show, "list": self.defaults.list, "edit": self.defaults.edit, "delete": self.defaults.delete}
        if name in standard:
            return standard[name](model)
        moves: tuple[MoveSubcommand, ...] = self.defaults.moves(model, command_paths)
        return next((move for move in moves if move.name == name), None)
