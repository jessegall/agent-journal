import json
import os
import shutil
import tempfile
from dataclasses import asdict, dataclass, replace
from pathlib import Path

from engine.proc import git
from features.session_recording.scrub import Scrubber
from resources.base import Refused
from engine.wording import digest

RESTORED = {"record/environments/": "environments/", "record/project/": "project/"}


@dataclass(frozen=True)
class Frame:
    at: float
    events: list
    changed: dict[str, str]
    gone: list[str]


def frames(folder: Path) -> list[Frame]:
    if not (folder / "frames.jsonl").is_file():
        raise Refused(f"{folder} holds no recording: journal record start writes frames.jsonl there")
    return [Frame(**json.loads(line)) for line in (folder / "frames.jsonl").read_text().splitlines() if line.strip()]


def readable(path: Path) -> str:
    try:
        return path.read_text()
    except UnicodeDecodeError:
        return ""


def recorded_files(folder: Path):
    frames(folder)
    yield folder / "frames.jsonl"
    for kind in ("blobs", "transcripts"):
        yield from sorted(path for path in (folder / kind).glob("*") if path.is_file())


def leaks(folder: Path, scrubber: Scrubber) -> list[str]:
    return [f"{path.relative_to(folder)}: {leak}" for path in recorded_files(folder) for leak in scrubber.leaks(readable(path))]


def scrubbed(folder: Path, scrubber: Scrubber) -> None:
    renamed = {}
    for path in recorded_files(folder):
        raw = readable(path)
        if not raw:
            continue
        clean = scrubber.text(raw)
        if path.parent.name == "blobs":
            renamed[path.name] = digest(clean)
            path.unlink()
            (path.parent / renamed[path.name]).write_text(clean)
        else:
            path.write_text(clean)
    rewritten = [replace(frame, changed={name: renamed.get(digest, digest) for name, digest in frame.changed.items()}) for frame in frames(folder)]
    (folder / "frames.jsonl").write_text("".join(json.dumps(asdict(frame)) + "\n" for frame in rewritten))


class Throwaway:
    def __init__(self, blobs: Path, name: str):
        self.blobs = blobs
        self.name = name
        self.lived: list[Path] = []
        self.project = self._cut(None)
        git(["init", "-q"], self.project)
        git(["hash-object", "-w", "--stdin-paths"], self.project, timeout=60, stdin="\n".join(str(blob) for blob in blobs.iterdir()))

    @property
    def root(self) -> Path:
        return self.project / ".journal"

    def _cut(self, old: Path | None) -> Path:
        project = Path(tempfile.mkdtemp()) / self.name
        project.mkdir()
        self.lived.append(project.parent)
        if old:
            shutil.copytree(old, project, copy_function=os.link, dirs_exist_ok=True)
        return project

    def target(self, name: str) -> Path:
        for prefix, folder in RESTORED.items():
            if name.startswith(prefix):
                return self.root / folder / name[len(prefix):]
        return self.project / name.removeprefix("files/")

    def restore(self, frame: Frame) -> None:
        self.project = self._cut(self.project)
        for name in frame.gone:
            self.target(name).unlink(missing_ok=True)
        for name, digest in frame.changed.items():
            target = self.target(name)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.unlink(missing_ok=True)
            target.write_bytes((self.blobs / digest).read_bytes())

    def cleared(self) -> None:
        for project in self.lived:
            shutil.rmtree(project, ignore_errors=True)

    def environments(self) -> list[str]:
        return sorted(path.name for path in (self.root / "environments").glob("*") if path.is_dir())

    def folders(self) -> list[str]:
        return [*(str(project.resolve()) for project in self.lived), *(str(project) for project in self.lived)]
