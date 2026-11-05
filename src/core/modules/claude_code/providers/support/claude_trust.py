from core.base.file_access import FileAccess
import json
import os
from pathlib import Path

from core.base.type_guards import is_mapping

TRUSTED_KEY = "hasTrustDialogAccepted"


class ClaudeTrust:
    """Claude Code's record of the folders the person trusts, in its state file: a folder is marked trusted
    before Claude Code starts there, so its trust question never stops a launch."""

    def __init__(self, state_file: Path) -> None:
        self.state_file = state_file

    def trusted(self, folder: Path) -> None:
        loaded: object = json.loads(FileAccess.shared().read(self.state_file)) if self.state_file.is_file() else {}
        state = dict(loaded) if is_mapping(loaded) else {}
        stored_projects = state.get("projects")
        projects = dict(stored_projects) if is_mapping(stored_projects) else {}
        entry = projects.get(str(folder))
        if is_mapping(entry) and entry.get(TRUSTED_KEY) is True:
            return
        projects[str(folder)] = {**(dict(entry) if is_mapping(entry) else {}), TRUSTED_KEY: True}
        state["projects"] = projects
        temporary_file = self.state_file.with_name(f".{self.state_file.name}.{os.getpid()}.journal")
        FileAccess.shared().write(temporary_file, json.dumps(state, indent=2) + "\n")
        FileAccess.shared().replace(temporary_file, self.state_file)
