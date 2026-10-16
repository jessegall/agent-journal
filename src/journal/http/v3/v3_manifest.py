import json
import re
from pathlib import Path

from journal.config import Config
from journal.features.registry import Registry
from journal.models.node_kind import NodeKind
from journal.repositories.charts import Charts

FIXTURE = Path(__file__).with_name("manifest.json")
DIST = Path(__file__).resolve().parents[3] / "web" / "dist" / "index.html"
RENAMED = {"todo": ("Task", "One unit of work with a life: open, started, done"), "helper": ("Worker", "An agent sent to write one bounded job"), "work": ("Work", "A task in hand and its log")}
VERSION = "4.0.0"


class V3Manifest:
    """The manifest version 3's viewer boots from: its type metadata as recorded from version 3, with this journal's own facts laid in."""

    def __init__(self, config: Config, registry: Registry, charts: Charts) -> None:
        self.config, self.registry, self.charts = config, registry, charts
        self._fixture = json.loads(FIXTURE.read_text())
        for name, (title, abstract) in RENAMED.items():
            meta = self._fixture["types"][name]
            meta.update(title=title, abstract=abstract)
            meta["event_labels"] = {key: label.replace("To-do", "Task").replace("Helper", "Worker").replace("helper", "worker") for key, label in meta.get("event_labels", {}).items()}
            meta["help"] = meta.get("help", "").replace("to-do", "task").replace("helper", "worker")

    def for_environment(self, environment: str) -> dict:
        return {**self._fixture, "features": self.features(), "groups": self.groups(), "models": [], "spoken": {},
                "environment": environment, "project": self.config.root.name, "branch": "", "build": self.build(), "version": VERSION, "facts": {}}

    def features(self) -> dict:
        """Every feature of version 4 as the settings page reads one: its switch, its words and its options, each option with the workflow nodes that read it."""
        readers = self.read_by()
        return {f.name: {"name": f.name, "label": f.title, "hint": f.help, "explains": f.help, "group": f.name, "default": f.default, "fixed": False,
                         "behaviours": {}, "nudges": {}, "trigger": {},
                         "settings": [{"name": o.name, "title": o.title, "abstract": o.abstract, "kind": o.kind, "default": o.default, "unit": o.unit, "choices": list(o.choices), "read_by": readers.get(o.key, [])} for o in f.options]}
                for f in self.registry.features}

    def read_by(self) -> dict[str, list[dict]]:
        """Which workflow's node reads each setting: a check node whose text names the setting's key; a setting no node names does nothing, and the page says so."""
        readers: dict[str, list[dict]] = {}
        for chart in self.charts.all():
            for node in self.charts.nodes_of(chart):
                if node.kind == NodeKind.CHECK and "." in node.text:
                    readers.setdefault(node.text, []).append({"workflow": chart.title, "node": node.id})
        return readers

    def groups(self) -> list[dict]:
        """One group per feature, led by it: those that speak to the agent in the Agent tab, the rest under Features."""
        return [{"key": f.name, "title": f.title, "line": f.help, "section": "Agent" if f.states or f.nudges else "Features", "tab": "agent" if f.states or f.nudges else "features", "lead": f.name}
                for f in self.registry.features]

    @staticmethod
    def build() -> str:
        """The viewer's own script file, which the page compares with the one it loaded to know whether a newer viewer is being served."""
        found = re.search(r'src="[^"]*?([^"/]+\.js)"', DIST.read_text()) if DIST.is_file() else None
        return found.group(1) if found else "journal-4"
