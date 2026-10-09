from pathlib import Path

import features
import migrations

BOOTED: set[Path] = set()


def boot(root: Path) -> None:
    root = Path(root).resolve()
    if root not in BOOTED:
        migrations.run(root, waiting=False)
        BOOTED.add(root)
    features.load(root)
