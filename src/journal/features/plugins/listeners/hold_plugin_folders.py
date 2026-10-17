from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.features.shell.writes import Writes
from journal.hooks.decision import Decision
from journal.providers.providers import Providers

PATH_KEYS = ("file_path", "path", "notebook_path")


class HoldPluginFolders(AgentListener[ToolStarting]):
    """The agent never changes an installed plugin's files: an edit or a shell line that writes into .journal/plugins is refused. Running a plugin's program is not writing to it. A linked folder is yours to work in, and the hash check switches its plugin off when its program changes."""

    blocking = True

    def __init__(self, config: Config, providers: Providers) -> None:
        self.config, self.providers = config, providers

    def handle(self, event: ToolStarting) -> Decision | None:
        if not event.writes or not any(self.inside(path) for path in self.written(event)):
            return None
        return Decision.refuse("an installed plugin's files are the user's to change: propose the change to them, or work in the plugin's own folder and let them upgrade it")

    def written(self, event: ToolStarting) -> list[str]:
        if event.tool == self.providers.named(event.provider or "claude").shell_tool:
            return Writes.targets(event.input.get("command", ""))
        return [value for key, value in event.input.items() if key in PATH_KEYS and isinstance(value, str)]

    def inside(self, path: str) -> bool:
        folder = (self.config.home / "plugins").resolve()
        return (self.config.root / Path(path).expanduser()).resolve().is_relative_to(folder)
