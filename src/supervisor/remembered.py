import json
from pathlib import Path


class Remembered:
    """The answers given last time, kept in the project so the menu's defaults are what you chose before."""

    def __init__(self, root: Path) -> None:
        self.path = root / ".journal" / "launch.json"

    def read(self) -> dict:
        if not self.path.is_file():
            return {}
        return json.loads(self.path.read_text() or "{}")

    def write(self, **answers) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps({**self.read(), **answers}))
