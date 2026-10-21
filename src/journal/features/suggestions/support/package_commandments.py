import json
from pathlib import Path
from urllib.parse import quote

from journal.config import Config
from journal.features.suggestions.support.suggester import Suggester
from journal.repositories.plugins import Plugins

PACKAGE = "jessegall/code-commandments"
PLUGIN = "code-commandments"
SOURCE = "https://github.com/jessegall/code-commandments"
STAMP = "@code-commandments-managed"
SETTINGS = (".claude/settings.json", ".claude/settings.local.json")


class PackageCommandments(Suggester):
    """Code Commandments installed in the project as a package, wiring its own hooks, while the journal does not run it as its plugin: suggested as the plugin instead, at its latest release."""

    key = "code-commandments-as-plugin"
    accept_label = "Install it as a plugin"

    def __init__(self, config: Config, plugins: Plugins) -> None:
        self.config, self.plugins = config, plugins

    def applies(self) -> bool:
        return (self.version() is not None or self.wires_hooks()) and not self.plugins.matching(name=PLUGIN)

    def title(self) -> str:
        return "Code Commandments runs here as a package. Run it as a journal plugin instead?"

    def detail(self) -> str:
        installed = f" {self.version()}" if self.version() else ""
        return (
            f"This project installs Code Commandments{installed} as a package, and the package wires its own hooks beside the journal's. "
            "As the journal's plugin it runs inside the journal at its latest release, its rules and languages are switches in its settings, "
            f"and it is upgraded with the journal. After installing the plugin, update the package (composer update {PACKAGE}) so its own hooks step aside, or remove it."
        )

    def goes_to(self) -> str:
        return f"plugins?install={quote(SOURCE, safe='')}"

    def version(self) -> str | None:
        lock = self.config.root / "composer.lock"
        if not lock.is_file():
            return None
        data = json.loads(lock.read_text())
        found = [p.get("version", "") for p in (*data.get("packages", []), *data.get("packages-dev", [])) if p.get("name") == PACKAGE]
        return found[0] if found else None

    def wires_hooks(self) -> bool:
        return any(STAMP in self.read(self.config.root / name) for name in SETTINGS)

    @staticmethod
    def read(path: Path) -> str:
        return path.read_text() if path.is_file() else ""
