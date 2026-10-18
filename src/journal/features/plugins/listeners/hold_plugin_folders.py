from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision
from journal.providers.providers import Providers


class HoldPluginFolders(AgentListener[ToolStarting]):
    """The agent never changes an installed plugin's files: an edit or a shell line that writes into .journal/plugins is refused. Running a plugin's program is not writing to it. A linked folder is yours to work in, and the hash check switches its plugin off when its program changes."""

    blocking = True

    def __init__(self, config: Config, providers: Providers) -> None:
        self.config, self.providers = config, providers

    def handle(self, event: ToolStarting) -> Decision | None:
        if not event.writes or not any(self.inside(path) for path in self.providers.named(event.provider or "claude").written_paths(event.tool, event.input)):
            return None
        return Decision.refuse("an installed plugin's files are the user's to change: propose the change to them, or work in the plugin's own folder and let them upgrade it")

    def inside(self, path: str) -> bool:
        folder = (self.config.home / "plugins").resolve()
        return (self.config.root / Path(path).expanduser()).resolve().is_relative_to(folder)
