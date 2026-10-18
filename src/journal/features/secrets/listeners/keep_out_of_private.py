import json
from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision
from journal.private_folder import PrivateFolder
from journal.secret_values import SecretValues

MARKERS = ("agent-journal/secrets", ".journal/keys")
"""Words that name the private folders whatever the path around them."""


class KeepOutOfPrivate(AgentListener[ToolStarting]):
    """No tool of the agent's touches the secrets folder or the MCP keys: a path into either, by any spelling that resolves there, or a shell line that names them, is refused. A tripwire, not a wall: the agent runs as the user."""

    blocking = True

    def __init__(self, config: Config, values: SecretValues) -> None:
        self.config, self.values = config, values

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.secrets.feature import Secrets
        return Decision.refuse(Secrets.KEPT_OUT.about().rendered()) if self.reaches(event.input) else None

    def reaches(self, given: dict) -> bool:
        named = [self.values.path.parent, PrivateFolder(self.config.root).keys_file().parent]
        folders = [folder.resolve() for folder in named]
        text = json.dumps(given)
        home = str(Path.home())
        spellings = [s for folder in {*named, *folders} for s in (str(folder), str(folder).replace(home, "~", 1), str(folder).replace(home, "$HOME", 1))]
        if any(word in text for word in (*MARKERS, *spellings)):
            return True
        paths = [value for key, value in given.items() if key in ("file_path", "path", "notebook_path") and isinstance(value, str)]
        return any(self.inside(Path(p).expanduser(), folders) for p in paths)

    def inside(self, path: Path, folders: list[Path]) -> bool:
        resolved = (self.config.root / path).resolve()
        return any(resolved == folder or resolved.is_relative_to(folder) for folder in folders)
