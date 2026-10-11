"""What the viewer's mascot page reads about the sprite sheets: their cell, the voices, and each clip's frames and speed."""
import json
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass(frozen=True)
class ClipInfo:
    frames: int
    fps: int
    loops: bool


@dataclass(frozen=True)
class Manifest:
    cell: tuple
    columns: int
    voices: tuple
    clips: dict

    @classmethod
    def load(cls, path):
        raw = json.loads(Path(path).read_text())
        return cls(tuple(raw["cell"]), raw["columns"], tuple(raw["voices"]), {name: ClipInfo(**clip) for name, clip in raw["clips"].items()})

    def dump(self, path):
        Path(path).write_text(json.dumps(asdict(self), indent=1))

    def sheet_size(self, clip):
        """The pixel size of one clip's sheet: its frames in rows of at most `columns`."""
        width, height = self.cell
        columns = min(self.columns, self.clips[clip].frames)
        rows = -(-self.clips[clip].frames // columns)
        return columns * width, rows * height
