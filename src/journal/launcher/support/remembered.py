import json
from dataclasses import asdict
from pathlib import Path

from journal.launcher.support.answers import Answers


class Remembered:
    """The answers given last time, kept in the project so the menu's defaults are what you chose before."""

    def __init__(self, root: Path) -> None:
        self.path = root / ".journal" / "launch.json"

    def read(self) -> Answers:
        if not self.path.is_file():
            return Answers()
        return Answers.from_json(json.loads(self.path.read_text() or "{}"))

    def write(self, answers: Answers) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(asdict(answers)))
