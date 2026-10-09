import os
import sys
from pathlib import Path

from providers import PROVIDERS
from providers.jsonl import WholeRead
from providers.search_folds import write

NICE = 19


def build(pairs: list[str]) -> None:
    """Reads each conversation, a provider and a path at a time, whole, and keeps its turns on disk for the searches of the server, at the lowest priority so nothing else waits for it."""
    os.nice(NICE)
    for provider, path in zip(pairs[::2], pairs[1::2]):
        transcript = Path(path)
        write(transcript, PROVIDERS[provider]().whole_turns(transcript, WholeRead.SEARCH))


if __name__ == "__main__":
    build(sys.argv[1:])
