import re
from pathlib import Path

from journal.config import Config
from journal.features.feature import Feature
from journal.features.registry import Registry
from journal.http.journal.journal_facts import JournalFacts
from journal.version import VERSION

DIST = Path(__file__).resolve().parents[3] / "web" / "dist" / "index.html"
PLACED = {"sharing": ("Sharing", "sharing"), "updates": ("Project", "system"), "record": ("Project", "system"), "faults": ("Developer", "developer")}
SYSTEM_GROUPS = [{"key": "project", "title": "Project", "line": "Settings for the whole project, in every environment", "section": "Project", "tab": "system", "lead": ""}]


class Manifest:
    """What the viewer boots from: the journal's project, version and build, and every feature that means something in this project, with its switch, its words and its options, in the groups the settings page shows."""

    def __init__(self, config: Config, registry: Registry) -> None:
        self.config, self.registry = config, registry

    def assembled(self, environment: str) -> JournalFacts:
        return JournalFacts(self.config.root.name, environment, VERSION, self.build(), self.features(), self.groups())

    def features(self) -> list[dict]:
        return [{"name": f.name, "title": f.title, "help": f.help, "default": f.default, "fixed": f.fixed,
                 "options": [{"key": o.key, "name": o.name, "title": o.title, "abstract": o.abstract, "kind": o.kind, "default": o.default, "unit": o.unit, "choices": list(o.choices),
                              "provider": o.provider} for o in f.options]}
                for f in self.applying()]


    def applying(self) -> list[type[Feature]]:
        return [f for f in self.registry.features if f.applies(self.config.root)]

    def groups(self) -> list[dict]:
        return [{"key": f.name, "title": f.title, "line": f.help, "section": self.placed(f)[0], "tab": self.placed(f)[1], "lead": f.name} for f in self.applying()] + SYSTEM_GROUPS

    @staticmethod
    def placed(feature: type[Feature]) -> tuple[str, str]:
        if feature.name in PLACED:
            return PLACED[feature.name]
        return ("Agent", "agent") if feature.states or feature.nudges else ("Features", "features")

    @staticmethod
    def build() -> str:
        rows = re.search(r'src="[^"]*?([^"/]+\.js)"', DIST.read_text()) if DIST.is_file() else None
        return rows.group(1) if rows else "journal-4"
