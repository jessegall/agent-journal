import hashlib
import json
import os
import shutil
import tempfile
from dataclasses import asdict, dataclass, replace
from collections.abc import Iterator
from pathlib import Path

import features
from commands.http import dispatch
from engine.proc import git
from features.session_recording.scrub import Scrubber
from resources.base import Refused

EVERYTHING = 100000
EVENTS = 1000
APP = {"manifest": "/api/manifest", "identity": "/api/identity", "pages": "/api/pages", "summary": "/api/summary", "agents": "/api/agents"}
ENVIRONMENT = {"settings": "settings", "bar": "bar", "family": "family"}
SETUP = ("feature", "record", "sequence", "trigger", "template")
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
            renamed[path.name] = hashlib.sha1(clean.encode()).hexdigest()
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

    def ask(self, path: str, query: dict | None = None) -> object:
        reply = dispatch("GET", path, self.root, query or {}, {})
        if reply.code != 200:
            raise Refused(f"the server answered {reply.code} to GET {path}: {reply.body}")
        return reply.body

    def answers(self, env: str) -> Iterator[tuple[str, object]]:
        manifest = self.ask(APP["manifest"])
        yield from ((name, self.ask(path)) for name, path in APP.items())
        yield from ((name, self.ask(f"/api/{env}/{path}")) for name, path in ENVIRONMENT.items())
        yield "events", [event for event in self.ask(f"/api/{env}/events", {"since": "0", "last": str(EVENTS)}) if event["type"] not in SETUP]
        rows = {kind: self.ask(f"/api/{env}/{kind}", {"completed": "1", "last": str(EVERYTHING)}) for kind in manifest["types"]}
        yield from ((f"rows.{kind}", listed) for kind, listed in rows.items())
        yield from self.edits(env, [agent["n"] for agent in rows["agent"]["rows"]])

    def edits(self, env: str, agents: list[int]) -> Iterator[tuple[str, object]]:
        for n in agents:
            feed = self.ask(f"/api/{env}/agent/{n}/edits", {"since": "0", "last": str(EVERYTHING)})
            yield f"edits.{n}", feed
            yield f"edited.{n}", {card["id"]: self.ask(f"/api/{env}/agent/{n}/edits/file", {"id": card["id"], "side": "after"}) for card in feed["edits"]}


def built(folder: Path, env: str = "") -> dict:
    scrubber = Scrubber()
    found = leaks(folder, scrubber)
    if found:
        raise Refused("the recording still holds the machine, run journal record scrub first: " + "; ".join(found[:5]))
    features.load()
    world = Throwaway(folder / "blobs", folder.resolve().name)
    stored: dict[str, object] = {}
    moments = []
    try:
        for frame in frames(folder):
            world.restore(frame)
            env = env or world.environments()[0]
            answers = {}
            for name, answer in world.answers(env):
                text = json.dumps(answer, sort_keys=True)
                answers[name] = hashlib.sha1(text.encode()).hexdigest()[:12]
                stored[answers[name]] = json.loads(text)
            moments.append({"at": frame.at, "events": len(frame.events), "answers": answers})
        shipped = Scrubber(world.folders())
        demo = json.loads(shipped.text(json.dumps({"answers": stored, "moments": moments})))
    finally:
        world.cleared()
    remaining = shipped.leaks(json.dumps(demo))
    if remaining:
        raise Refused("the demo's data still holds the machine: " + "; ".join(remaining[:5]))
    return demo
