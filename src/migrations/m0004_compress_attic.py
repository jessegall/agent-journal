from pathlib import Path

from engine.attic import compress


def run(root: Path) -> list[str]:
    return compress(root)
