from argparse import ArgumentParser


def dependency_arguments(parser: ArgumentParser) -> None:
    parser.add_argument("task_id", type=int)
    parser.add_argument("--on", type=int, required=True, dest="dependency_id")
