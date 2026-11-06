from argparse import SUPPRESS, ArgumentParser


def add_positional_or_flag(parser: ArgumentParser, name: str) -> None:
    argument = parser.add_mutually_exclusive_group(required=True)
    argument.add_argument(name, nargs="?", default=SUPPRESS)
    argument.add_argument(f"--{name}", dest=name, default=SUPPRESS)
