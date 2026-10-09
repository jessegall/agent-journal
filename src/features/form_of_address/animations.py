import re
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path

from resources.base import Refused

SUFFIX = re.compile(r"_(sheet|atlas)$")
KIND = re.compile(r"[a-z][a-z0-9-]*$")
FRAME = 256
MAX_ENTRIES = 200
MAX_BYTES = 40_000_000


@dataclass(frozen=True)
class Animation:
    """One sheet of a voice, read from its file name: <voice>_<kind>_<name>_sheet.png, the voice prefix and the sheet or atlas ending optional."""
    kind: str
    name: str
    file: str
    shipped: bool = False

    @classmethod
    def of(cls, file: str, voice: str, shipped: bool = False) -> "Animation | None":
        path = Path(file)
        if path.suffix.lower() != ".png":
            return None
        words = SUFFIX.sub("", path.stem.lower().replace(" ", "_"))
        words = words.removeprefix(f"{voice}_") if voice else words
        kind, _, name = words.partition("_")
        return cls(kind, name, file, shipped) if KIND.match(kind) else None

    def view(self, path: str = "") -> dict:
        return {**asdict(self), "path": path or self.file}


def voice_of(art: str) -> str:
    return Path(art).stem.lower()


def shipped_animations(voices: Path, art: str) -> list[Animation]:
    """The animations a voice ships with, found by file name in the newest folder that holds any: a subfolder before the voices folder itself."""
    voice = voice_of(art)
    if not voice or not voices.is_dir():
        return []
    for folder in [*sorted((p for p in voices.rglob("*") if p.is_dir()), reverse=True), voices]:
        found = [Animation.of(str(f.relative_to(voices)), voice, shipped=True) for f in sorted(folder.glob(f"{voice}_*.png"))]
        if any(found):
            return [animation for animation in found if animation]
    return []


def unpacked(archive: Path, into: Path) -> list[Path]:
    """The sheets of a dropped ZIP, written flat into a folder under a safe name; anything that is not a sheet is left in the archive."""
    sheets = []
    with zipfile.ZipFile(archive) as zipped:
        entries = [e for e in zipped.infolist() if not e.is_dir() and Path(e.filename).suffix.lower() == ".png" and not Path(e.filename).name.startswith(".")]
        if len(entries) > MAX_ENTRIES or sum(e.file_size for e in entries) > MAX_BYTES:
            raise Refused(f"the ZIP holds too many or too large sheets: at most {MAX_ENTRIES} files and {MAX_BYTES // 1_000_000} MB")
        for entry in entries:
            target = into / Path(entry.filename).name
            target.write_bytes(zipped.read(entry))
            sheets.append(target)
    if not sheets:
        raise Refused("the ZIP holds no PNG sheets: name each one <kind>_<name>.png, such as idle_wave.png")
    return sheets
