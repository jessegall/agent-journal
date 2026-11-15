from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from functools import cache
from core.modules.secrets.nudges.secrets_folder_ban_nudge import SecretsFolderBanNudge
import json
from pathlib import Path

from engine.private.private_folder import PrivateFolder

MARKERS = ("agent-journal/secrets", ".journal/keys")


class SecretsFolderPolicy(EventPolicy):
    """A tool that names the secrets folder, or version 4's folder of server keys, by any spelling of its path
    is refused: a secret reaches a program only through journal secret run."""

    key = "secrets.secrets-folder"
    rank = "safety.all"
    is_safety = True
    grant_types = []

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        tool = event.tool
        if tool is None:
            return None
        tool_texts = (*tool.files, *(tool.shell.part_texts if tool.shell is not None else ()), json.dumps(dict(event.tool_input()), default=str))
        if not any(spelling in tool_text for tool_text in tool_texts for spelling in self.spellings()):
            return None
        return SecretsFolderBanNudge.declared().nudge()

    def spellings(self) -> tuple[str, ...]:
        return folder_spellings(str(self.folder.folder), str(Path.home()))



# resolving the folder checks each folder of its path, so a server works the spellings out once per folder and home
@cache
def folder_spellings(folder: str, home: str) -> tuple[str, ...]:
    folders = {folder, str(Path(folder).resolve())}
    return (*MARKERS, *folders, *(spelling.replace(home, "~", 1) for spelling in folders if spelling.startswith(home)),
            *(spelling.replace(home, "$HOME", 1) for spelling in folders if spelling.startswith(home)))
