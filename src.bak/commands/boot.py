from pathlib import Path

import features
import migrations

BOOTED: set[Path] = set()


def boot(root: Path) -> None:
    root = Path(root).resolve()
    if root in BOOTED:
        return
    migrations.run(root, waiting=False)
    features.load(root)
    BOOTED.add(root)
