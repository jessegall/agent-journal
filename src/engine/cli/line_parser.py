from argparse import ArgumentParser

from engine.cli.subcommand_lookup import AnySubcommand, SubcommandLookup
from engine.cli.write_flags import WriteFlags
from engine.subcommand.subcommand import Subcommand


class LineParser:
    """Builds the parser of one command line's subcommand, with --json and, for a command, the write flags;
    the one place a line's arguments are worked out, for the console and for every check of a line."""

    def __init__(self, lookup: SubcommandLookup, flags: WriteFlags) -> None:
        self.lookup, self.flags = lookup, flags

    def parser(self, argv: list[str]) -> tuple[AnySubcommand, ArgumentParser]:
        subcommand = self.lookup.subcommand(argv[0], argv[1])
        parser = ArgumentParser(prog=f"journal {argv[0]} {argv[1]}", description=subcommand.help, allow_abbrev=False)
        parser.add_argument("--json", action="store_true")
        subcommand.arguments(parser)
        if isinstance(subcommand, Subcommand):
            self.flags.add(parser)
        else:
            parser.add_argument("--environment")
            self.flags.declare_reason_flag(parser)
        return subcommand, parser
