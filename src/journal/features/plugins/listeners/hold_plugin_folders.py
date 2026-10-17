import json
from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision

PATH_KEYS = ("file_path", "path", "notebook_path")


class HoldPluginFolders(AgentListener[ToolStarting]):
    """The agent never changes an installed plugin's files: a write into .journal/plugins is refused. A linked folder is yours to work in, and the hash check switches its plugin off when its program changes."""

    blocking = True

    def __init__(self, config: Config) -> None:
        self.config = config

    def handle(self, event: ToolStarting) -> Decision | None:
        if not event.writes or not self.reaches(event.input):
            return None
        return Decision.refuse("an installed plugin's files are the user's to change: propose the change to them, or work in the plugin's own folder and let them upgrade it")

    def reaches(self, given: dict) -> bool:
        folder = (self.config.home / "plugins").resolve()
        if ".journal/plugins/" in json.dumps(given) or str(folder) in json.dumps(given):
            return True
        paths = [value for key, value in given.items() if key in PATH_KEYS and isinstance(value, str)]
        return any((self.config.root / Path(p).expanduser()).resolve().is_relative_to(folder) for p in paths)
