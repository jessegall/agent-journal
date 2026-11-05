from argparse import ArgumentParser


class ItemArguments:
    """The arguments of a subcommand that names one item of the shared server: its kind and its number."""

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("share", metavar="kind")
        parser.add_argument("item_id", metavar="id", type=int)
