from collections.abc import Sequence
from engine.bookkeeping.bookkeeping_subcommands import BOOKKEEPING_SUBCOMMANDS
from engine.cli.default_subcommands import DefaultSubcommands
from engine.cli.move_subcommand import MoveSubcommand
from core.base.subcommand.subcommand import Subcommand, is_subcommand_class
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.command.command import Command
from engine.container.container import Container
from engine.model.model import Model
from core.base.registry.registry import Registry
from engine.cli.usage_error import UsageError


AnySubcommand = Subcommand[Command[object], object] | ReadSubcommand[object]
STANDARD_SUBCOMMANDS = ("make", "show", "list", "edit", "delete")


class SubcommandLookup:
    """Chooses the subcommand a command line asks for: a module's own when it wrote one, else the one the core
    builds for the model; it imports that subcommand and nothing else."""

    def __init__(self, registry: Registry, container: Container, defaults: DefaultSubcommands) -> None:
        self.registry, self.container, self.defaults = registry, container, defaults

    def subcommand(self, cli_name: str, name: str) -> AnySubcommand:
        bookkeeping = BOOKKEEPING_SUBCOMMANDS.get(f"{cli_name} {name}")
        if bookkeeping is not None:
            return self.container.get(bookkeeping)
        module_subcommand = self.registry.subcommands.get(f"{cli_name} {name}")
        if module_subcommand is not None:
            subcommand_class = module_subcommand.loaded()
            if is_subcommand_class(subcommand_class):
                return self.container.get(subcommand_class)
        entry = self.registry.models.get(cli_name)
        if entry is None or name in entry.excluded_subcommands:
            raise self.no_subcommand(cli_name, name)
        model = entry.model.loaded()
        if not issubclass(model, Model):
            raise UsageError(f"{entry.model.text} is no model")
        built = self.built(model, entry.commands, name)
        if built is None:
            raise self.no_subcommand(cli_name, name)
        return built

    def no_subcommand(self, cli_name: str, name: str) -> UsageError:
        names = self.names(cli_name)
        if not names:
            return UsageError(f"journal has no {cli_name} commands: journal --help lists them")
        return UsageError(f"journal {cli_name} has no subcommand {name}; it has: {', '.join(names)}")

    def cli_names(self) -> list[str]:
        return sorted({*self.registry.models, *(line.split(" ", 1)[0] for line in (*self.registry.subcommands, *BOOKKEEPING_SUBCOMMANDS))})

    def names(self, cli_name: str) -> list[str]:
        terms = {line.split(" ", 1)[1] for line in (*self.registry.subcommands, *BOOKKEEPING_SUBCOMMANDS) if line.startswith(f"{cli_name} ")}
        entry = self.registry.models.get(cli_name)
        model = entry.model.loaded() if entry is not None else None
        if entry is not None and isinstance(model, type) and issubclass(model, Model):
            terms |= {*STANDARD_SUBCOMMANDS, *(move.name for move in self.defaults.moves(model, entry.commands))} - set(entry.excluded_subcommands)
        return sorted(terms)

    def built(self, model: type[Model], command_paths: Sequence[str], name: str) -> AnySubcommand | None:
        standard = {"make": self.defaults.make, "show": self.defaults.show, "list": self.defaults.list, "edit": self.defaults.edit, "delete": self.defaults.delete}
        if name in standard:
            return standard[name](model)
        moves: tuple[MoveSubcommand, ...] = self.defaults.moves(model, command_paths)
        return next((move for move in moves if move.name == name), None)
