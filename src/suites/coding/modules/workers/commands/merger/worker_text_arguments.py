from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser


def worker_text_arguments(parser: ArgumentParser, text_name: str) -> None:
    parser.add_argument("worker_id", type=AgentNumber)
    parser.add_argument(text_name)
