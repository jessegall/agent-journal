"""What prove_rig.py measured about each figure, as values the test can read without Blender."""
import json
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass(frozen=True)
class Stretch:
    worst_part: str
    longest: float
    shortest: float
    stretched: int
    squashed: int


@dataclass(frozen=True)
class PoseReport:
    body: Stretch
    garment_drift: dict


@dataclass(frozen=True)
class FigureReport:
    bones: list
    unweighted: int
    most_bones: int
    worst_sum_error: float
    meshes: int
    legwear_on_thighs: float | None
    poses: dict


def load(path):
    """The report of every figure, by voice, as written by dump."""
    reports = {}
    for voice, figure in json.loads(Path(path).read_text()).items():
        poses = {name: PoseReport(Stretch(**pose["body"]), pose["garment_drift"]) for name, pose in figure["poses"].items()}
        reports[voice] = FigureReport(**{**figure, "poses": poses})
    return reports


def dump(reports, path):
    Path(path).write_text(json.dumps({voice: asdict(report) for voice, report in reports.items()}, indent=1))
