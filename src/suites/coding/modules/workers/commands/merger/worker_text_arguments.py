from argparse import ArgumentParser


def worker_text_arguments(parser: ArgumentParser, text_name: str) -> None:
    parser.add_argument("worker_id", type=int)
    parser.add_argument(text_name)
