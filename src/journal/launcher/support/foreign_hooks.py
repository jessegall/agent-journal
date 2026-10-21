import json
import shutil
from pathlib import Path

from journal.launcher.support.program_settings import ProgramSettings

FILES = {"claude": (".claude/settings.json", ".claude/settings.local.json", "~/.claude/settings.json"), "codex": (".codex/hooks.json", "~/.codex/hooks.json")}


class ForeignHooks:
    """The hooks in the agent's settings that are not the journal's: set aside for a run so they cannot fight the journal's, and put back when the run ends. A copy of each file is kept in .journal/runtime/set-aside, and only the hooks key is put back, so edits made to the rest of the file meanwhile stay."""

    def __init__(self, root: Path, agent: str) -> None:
        self.root, self.agent = root, agent
        self.folder = root / ".journal" / "runtime" / "set-aside"
        self.listing = self.folder / "moved.json"

    def files(self) -> list[Path]:
        return [self.root / name if not name.startswith("~") else Path(name).expanduser() for name in FILES[self.agent]]

    def others(self) -> list[Path]:
        return [path for path in self.files() if path.is_file() and ProgramSettings.read(path).stored() != ProgramSettings.read(path)]

    def set_aside(self) -> list[Path]:
        self.put_back()
        moved = []
        self.folder.mkdir(parents=True, exist_ok=True)
        for i, path in enumerate(self.others()):
            copy = self.folder / f"hooks-{i}-{path.name}"
            shutil.copy2(path, copy)
            path.write_text(json.dumps(ProgramSettings.read(path).stored().to_json(), indent=2) + "\n")
            moved.append({"from": str(path), "to": str(copy)})
        self.listing.write_text(json.dumps(moved))
        return [Path(m["from"]) for m in moved]

    def put_back(self) -> list[Path]:
        moved = json.loads(self.listing.read_text()) if self.listing.is_file() else []
        for m in moved:
            copy, home = Path(m["to"]), Path(m["from"])
            if copy.is_file():
                home.write_text(json.dumps(ProgramSettings.read(home).with_hooks_of(ProgramSettings.read(copy)).to_json(), indent=2) + "\n")
                copy.unlink()
        self.listing.unlink(missing_ok=True)
        return [Path(m["from"]) for m in moved]
