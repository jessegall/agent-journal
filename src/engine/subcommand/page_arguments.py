from argparse import ArgumentParser, ArgumentTypeError
from engine.query.query import MOST_DECLARED_LIMIT_ROWS, PAGE_SIZE_ROWS


# A user's --limit, from 1 to the most rows one read may name.
def read_limit(text: str) -> int:
    rows = int(text)
    if not 1 <= rows <= MOST_DECLARED_LIMIT_ROWS:
        raise ArgumentTypeError(f"--limit is from 1 to {MOST_DECLARED_LIMIT_ROWS}; read further rows with --page")
    return rows


def page_arguments(parser: ArgumentParser) -> None:
    parser.add_argument("--page", type=int, default=1)
    parser.add_argument("--limit", type=read_limit, default=PAGE_SIZE_ROWS)
