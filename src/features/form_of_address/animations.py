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
MAX_FRAMES = 64
MAX_MS = 10_000
MAX_GAP = 3600
MAX_WEIGHT = 1000


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


@dataclass(frozen=True)
class FrameTuning:
    """How one frame is shown: moved by x and y pixels of its 256 px cell, held for ms milliseconds (0 keeps the animation's own time)."""
    x: int = 0
    y: int = 0
    ms: int = 0


@dataclass(frozen=True)
class Tuning:
    """How an animation is shown, kept beside its sheet: one time for every frame and a tuning per frame."""
    ms: int = 0
    frames: tuple[FrameTuning, ...] = ()

    @classmethod
    def from_payload(cls, payload: dict) -> "Tuning":
        frames = payload.get("frames") or []
        if not isinstance(frames, list) or len(frames) > MAX_FRAMES:
            raise Refused(f"an animation has at most {MAX_FRAMES} frames")
        return cls(_within(payload.get("ms"), 0, MAX_MS), tuple(FrameTuning(_within(f.get("x"), -FRAME, FRAME), _within(f.get("y"), -FRAME, FRAME), _within(f.get("ms"), 0, MAX_MS)) for f in frames))

    def view(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class Gap:
    """A range of seconds the mascot waits between two plays of one kind of animation."""
    min: int
    max: int

    @classmethod
    def from_payload(cls, payload: dict, kind: str) -> "Gap":
        low, high = _within(payload.get("min"), 1, MAX_GAP), _within(payload.get("max"), 1, MAX_GAP)
        if low > high:
            raise Refused(f"the {kind} animations wait from {low} to {high} seconds: the least cannot be above the most")
        return cls(low, high)


@dataclass(frozen=True)
class Schedule:
    """When a voice's mascot plays what: how long it waits between blinks and between its other idle animations, and the weight that picks which idle animation plays."""
    blink: Gap = Gap(5, 10)
    idle: Gap = Gap(20, 30)
    weights: tuple[tuple[str, int], ...] = ()

    @classmethod
    def from_payload(cls, payload: dict, known: set[str]) -> "Schedule":
        weights = payload.get("weights") or {}
        unknown = sorted(set(weights) - known)
        if unknown:
            raise Refused(f"no animation {unknown[0]} to weigh")
        return cls(Gap.from_payload(payload.get("blink") or {"min": 5, "max": 10}, "blink"), Gap.from_payload(payload.get("idle") or {"min": 20, "max": 30}, "idle"),
                   tuple(sorted((path, _within(weight, 0, MAX_WEIGHT)) for path, weight in weights.items())))

    def view(self) -> dict:
        return {"blink": asdict(self.blink), "idle": asdict(self.idle), "weights": dict(self.weights)}


def _within(value, low: int, high: int) -> int:
    try:
        return max(low, min(high, round(float(value or 0))))
    except (TypeError, ValueError) as error:
        raise Refused(f"{value!r} is not a number") from error


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
