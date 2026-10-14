import json
import re
from pathlib import Path

from journal.config import Config
from journal.features.registry import Registry

FIXTURE = Path(__file__).with_name("manifest.json")
DIST = Path(__file__).resolve().parents[3] / "web" / "dist" / "index.html"
RENAMED = {"todo": ("Task", "One unit of work with a life: open, started, done"), "helper": ("Worker", "An agent sent to write one bounded job"), "work": ("Work", "A task in hand and its log")}
VERSION = "4.0.0"


class V3Manifest:
    """The manifest version 3's viewer boots from: its type metadata as recorded from version 3, with this journal's own facts laid in."""

    def __init__(self, config: Config, registry: Registry) -> None:
        self.config, self.registry = config, registry
        self._fixture = json.loads(FIXTURE.read_text())
        for name, (title, abstract) in RENAMED.items():
            meta = self._fixture["types"][name]
            meta.update(title=title, abstract=abstract)
            meta["event_labels"] = {key: label.replace("To-do", "Task").replace("Helper", "Worker").replace("helper", "worker") for key, label in meta.get("event_labels", {}).items()}
            meta["help"] = meta.get("help", "").replace("to-do", "task").replace("helper", "worker")

    def for_environment(self, environment: str) -> dict:
        return {**self._fixture, "environment": environment, "project": self.config.root.name, "branch": "", "build": self.build(), "version": VERSION, "facts": {}}

    @staticmethod
    def build() -> str:
        """The viewer's own script file, which the page compares with the one it loaded to know whether a newer viewer is being served."""
        found = re.search(r'src="[^"]*?([^"/]+\.js)"', DIST.read_text()) if DIST.is_file() else None
        return found.group(1) if found else "journal-4"
