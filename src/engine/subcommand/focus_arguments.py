from argparse import ArgumentParser


def focus_arguments(parser: ArgumentParser, row_argument: str) -> None:
    """A focus choice: the row to focus, or none to read the focus, and --clear to give the default back."""
    parser.add_argument(row_argument, type=int, nargs="?", default=None)
    parser.add_argument("--clear", dest="clears", action="store_true")
