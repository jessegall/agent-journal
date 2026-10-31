from argparse import Namespace
from dataclasses import dataclass

from core.base.cli.subcommand_lookup import AnySubcommand
from core.base.subcommand.subcommand import Subcommand


@dataclass(frozen=True)
class ParsedLine:
    """A command line parsed the way the console parses it: the subcommand it resolves to and its arguments."""

    subcommand: AnySubcommand
    arguments: Namespace

    @property
    def line(self) -> str:
        return f"{self.subcommand.cli_name} {self.subcommand.name}"

    @property
    def is_read(self) -> bool:
        return not isinstance(self.subcommand, Subcommand)
