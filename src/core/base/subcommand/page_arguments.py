from argparse import ArgumentParser
from core.base.query.query import PAGE_SIZE_ROWS


def page_arguments(parser: ArgumentParser) -> None:
    parser.add_argument("--page", type=int, default=1)
    parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
