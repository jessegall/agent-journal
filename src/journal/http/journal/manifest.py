import re
from pathlib import Path

from journal.config import Config
from journal.features.feature import Feature
from journal.features.registry import Registry
from journal.http.journal.journal_facts import JournalFacts
from journal.models.node_kind import NodeKind
from journal.repositories.charts import Charts
from journal.version import VERSION

DIST = Path(__file__).resolve().parents[3] / "web" / "dist" / "index.html"
PLACED = {"sharing": ("Sharing", "sharing")}
"""Features the settings page shows in a tab of their own, by name: the section and the tab."""
SYSTEM_GROUPS = [{"key": "project", "title": "Project", "line": "Settings for the whole project, in every environment", "section": "Project", "tab": "system", "lead": ""}]
"""The System tab's groups, filled by the viewer's own settings: the project's colour and what the viewer shows."""


class Manifest:
    """What the viewer boots from: the journal's project, version and build, and every feature with its switch, its words and its options, in the groups the settings page shows."""

    def __init__(self, config: Config, registry: Registry, charts: Charts) -> None:
        self.config, self.registry, self.charts = config, registry, charts

    def of(self, environment: str) -> JournalFacts:
        return JournalFacts(self.config.root.name, environment, VERSION, self.build(), self.features(), self.groups())

    def features(self) -> list[dict]:
        """Every feature as the settings page reads one: its switch, its words and its options, each option with the workflow nodes that read it."""
        readers = self.read_by()
        return [{"name": f.name, "title": f.title, "help": f.help, "default": f.default, "fixed": f.fixed,
                 "options": [{"key": o.key, "name": o.name, "title": o.title, "abstract": o.abstract, "kind": o.kind, "default": o.default, "unit": o.unit, "choices": list(o.choices),
                              "provider": o.provider, "read_by": readers.get(o.key, [])} for o in f.options]}
                for f in self.registry.features]

    def read_by(self) -> dict[str, list[dict]]:
        """Which workflow's node reads each setting: a check node whose text ends with the setting's key, alone or after a count's name; a setting no node names does nothing, and the page says so."""
        readers: dict[str, list[dict]] = {}
        for chart in self.charts.all():
            for node in self.charts.nodes_of(chart):
                words = node.text.split()
                if node.kind == NodeKind.CHECK and words and "." in words[-1]:
                    readers.setdefault(words[-1], []).append({"workflow": chart.title, "node": node.id})
        return readers

    def groups(self) -> list[dict]:
        """One group per feature, led by it: those that speak to the agent in the Agent tab, sharing in its own, the rest under Features; then the System tab's."""
        return [{"key": f.name, "title": f.title, "line": f.help, "section": self.placed(f)[0], "tab": self.placed(f)[1], "lead": f.name} for f in self.registry.features] + SYSTEM_GROUPS

    @staticmethod
    def placed(feature: Feature) -> tuple[str, str]:
        if feature.name in PLACED:
            return PLACED[feature.name]
        return ("Agent", "agent") if feature.states or feature.nudges else ("Features", "features")

    @staticmethod
    def build() -> str:
        """The viewer's own script file, which the page compares with the one it loaded to know whether a newer viewer is being served."""
        found = re.search(r'src="[^"]*?([^"/]+\.js)"', DIST.read_text()) if DIST.is_file() else None
        return found.group(1) if found else "journal-4"
