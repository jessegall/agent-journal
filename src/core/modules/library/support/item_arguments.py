from argparse import ArgumentParser


class ItemArguments:
    """The arguments of a subcommand that names one item of the shared server: its type and its number."""

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("share", metavar="type")
        parser.add_argument("item_id", metavar="id", type=int)
