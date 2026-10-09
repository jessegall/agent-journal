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
OFFSETS = "_offsets.json"
ORIGIN = "resting pose tile top-left at stage x=256, y=256; apply offset_x and offset_y in pixels"
SHEET = re.compile(r"_(sheet|atlas)\.png$", re.I)
MAX_WEIGHT = 1000
RIGS = "rigs"
MAX_SPOT = 128


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
class Spot:
    """How far a voice's mascot is moved from where its art puts it on the chat box, in pixels of its 256 px cell: right and down."""
    x: int = 0
    y: int = 0

    @classmethod
    def from_payload(cls, payload: dict) -> "Spot":
        return cls(_within(payload.get("x"), -MAX_SPOT, MAX_SPOT), _within(payload.get("y"), -MAX_SPOT, MAX_SPOT))


@dataclass(frozen=True)
class Schedule:
    """When a voice's mascot plays what: how long it waits between blinks and between its other idle animations, and the weight that picks which idle animation plays."""
    blink: Gap = Gap(5, 10)
    idle: Gap = Gap(20, 30)
    weights: tuple[tuple[str, int], ...] = ()
    place: Spot = Spot()

    @classmethod
    def from_payload(cls, payload: dict, known: set[str]) -> "Schedule":
        weights = payload.get("weights") or {}
        unknown = sorted(set(weights) - known)
        if unknown:
            raise Refused(f"no animation {unknown[0]} to weigh")
        return cls(Gap.from_payload(payload.get("blink") or {"min": 5, "max": 10}, "blink"), Gap.from_payload(payload.get("idle") or {"min": 20, "max": 30}, "idle"),
                   tuple(sorted((path, _within(weight, 0, MAX_WEIGHT)) for path, weight in weights.items())), Spot.from_payload(payload.get("place") or {}))

    def view(self) -> dict:
        return {"blink": asdict(self.blink), "idle": asdict(self.idle), "weights": dict(self.weights), "place": asdict(self.place)}


def _within(value, low: int, high: int) -> int:
    try:
        return max(low, min(high, round(float(value or 0))))
    except (TypeError, ValueError) as error:
        raise Refused(f"{value!r} is not a number") from error


def offsets_name(file: str) -> str:
    """The offsets file that goes with a sheet: its name without the sheet or atlas ending, then _offsets.json."""
    return SUFFIX.sub("", Path(file).stem) + OFFSETS


def tuning_of(document: dict) -> dict | None:
    """A voice's way of showing an animation, read from its offsets file: per-frame offset_x and offset_y, and the optional frame_ms and duration_ms."""
    frames = document.get("frames")
    if not isinstance(frames, list) or not frames:
        return None
    return Tuning(_within(document.get("frame_ms"), 0, MAX_MS), tuple(
        FrameTuning(_within(f.get("offset_x"), -FRAME, FRAME), _within(f.get("offset_y"), -FRAME, FRAME), _within(f.get("duration_ms"), 0, MAX_MS)) for f in frames[:MAX_FRAMES]
    )).view()


def offsets_document(animation: Animation, tuning: Tuning, base: dict | None, size: tuple[int, int], voice: str = "") -> dict:
    """The offsets file for a tuning, in the format the animations are delivered in: the delivered file with its offsets and times replaced, or a new one for a sheet that came without."""
    stem = SUFFIX.sub("", Path(animation.file).stem)
    document = dict(base) if base else {
        "voice": voice, "animation": "_".join(part for part in (animation.kind, animation.name) if part), "frame_size": [FRAME, FRAME], "atlas_file": Path(animation.file).name,
        "atlas_size": list(size), "origin": ORIGIN,
        "frames": [{"frame": i + 1, "file": f"{stem}_{i + 1}.png", "atlas_x": i * FRAME, "atlas_y": 0, "offset_x": 0, "offset_y": 0} for i in range(max(1, size[0] // FRAME))],
    }
    frames = []
    for index, frame in enumerate(document["frames"]):
        tuned = tuning.frames[index] if index < len(tuning.frames) else FrameTuning()
        frames.append({**{k: v for k, v in frame.items() if k != "duration_ms"}, "offset_x": tuned.x, "offset_y": tuned.y, **({"duration_ms": tuned.ms} if tuned.ms else {})})
    document = {k: v for k, v in document.items() if k != "frame_ms"}
    return {**document, **({"frame_ms": tuning.ms} if tuning.ms else {}), "frames": frames}


def voice_of(art: str) -> str:
    return Path(art).stem.lower()


def shipped_animations(voices: Path, art: str) -> list[Animation]:
    """The animations a voice ships with, found by file name in the newest folder that holds any: a subfolder before the voices folder itself."""
    voice = voice_of(art)
    if not voice or not voices.is_dir():
        return []
    sheets = (p for p in voices.rglob("*") if p.is_dir() and RIGS not in p.relative_to(voices).parts)
    for folder in [*sorted(sheets, reverse=True), voices]:
        found = [Animation.of(str(f.relative_to(voices)), voice, shipped=True) for f in sorted(folder.glob(f"{voice}_*.png"))]
        if any(found):
            return [animation for animation in found if animation]
    return []


def unpacked(archive: Path, into: Path) -> list[Path]:
    """The sheets of a dropped ZIP, written flat into a folder under a safe name; anything that is not a sheet is left in the archive."""
    sheets = []
    with zipfile.ZipFile(archive) as zipped:
        entries = [e for e in zipped.infolist() if not e.is_dir() and not Path(e.filename).name.startswith(".") and not e.filename.startswith("__MACOSX")]
        delivered = [e for e in entries if SHEET.search(e.filename) or e.filename.endswith(OFFSETS)]
        entries = delivered if any(SHEET.search(e.filename) for e in delivered) else [e for e in entries if Path(e.filename).suffix.lower() == ".png"]
        if len(entries) > MAX_ENTRIES or sum(e.file_size for e in entries) > MAX_BYTES:
            raise Refused(f"the ZIP holds too many or too large sheets: at most {MAX_ENTRIES} files and {MAX_BYTES // 1_000_000} MB")
        for entry in entries:
            target = into / Path(entry.filename).name
            target.write_bytes(zipped.read(entry))
            sheets.append(target)
    if not sheets:
        raise Refused("the ZIP holds no PNG sheets: name each one <kind>_<name>.png, such as idle_wave.png")
    return sheets
