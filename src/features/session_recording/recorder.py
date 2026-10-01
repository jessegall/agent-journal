import hashlib
import json
import os
import sys
import time
from pathlib import Path

POLL = 0.5
PRUNED = {"runtime", "attic", "node_modules", "__pycache__", ".git"}
LEFT_OUT = {".journal", ".claude", ".codex", ".agents", ".git"}


def walked(base: Path, left_out: set[str]):
    for folder, names, files in os.walk(base):
        names[:] = [name for name in names if name not in PRUNED and not (Path(folder) == base and name in left_out)]
        for name in files:
            yield Path(folder) / name


class Recorder:
    def __init__(self, root: Path, folder: Path):
        self.root = root
        self.frames = folder / "frames.jsonl"
        self.blobs = folder / "blobs"
        self.blobs.mkdir(parents=True, exist_ok=True)
        self.read: dict[Path, int] = {}
        self.stamps: dict[Path, tuple[int, int, str]] = {}
        self.last: dict[str, str] = {}

    def poll(self) -> bool:
        events = self._events()
        if not events:
            return False
        now = self._snapshot()
        frame = {"at": time.time(), "events": events,
                 "changed": {name: digest for name, digest in now.items() if self.last.get(name) != digest},
                 "gone": [name for name in self.last if name not in now]}
        with self.frames.open("a") as out:
            out.write(json.dumps(frame) + "\n")
        self.last = now
        return True

    def _events(self) -> list[dict]:
        events = []
        for log in sorted((self.root / "environments").glob("*/events.jsonl")):
            size = log.stat().st_size
            start = self.read.get(log, 0)
            if size <= start:
                continue
            with log.open("rb") as handle:
                handle.seek(start)
                fresh = handle.read(size - start)
            whole = fresh[:fresh.rfind(b"\n") + 1]
            self.read[log] = start + len(whole)
            events += [json.loads(line) for line in whole.splitlines() if line.strip()]
        return events

    def _snapshot(self) -> dict[str, str]:
        now = {}
        for where, base, left_out in (("record/environments", self.root / "environments", set()),
                                      ("record/project", self.root / "project", set()),
                                      ("files", self.root.parent, LEFT_OUT)):
            for path in walked(base, left_out) if base.is_dir() else ():
                digest = self._stored(path)
                if digest:
                    now[f"{where}/{path.relative_to(base)}"] = digest
        return now

    def _stored(self, path: Path) -> str:
        try:
            stat = path.stat()
            stamp = self.stamps.get(path)
            if stamp and stamp[:2] == (stat.st_mtime_ns, stat.st_size):
                return stamp[2]
            raw = path.read_bytes()
        except OSError:
            return ""
        digest = hashlib.sha1(raw).hexdigest()
        blob = self.blobs / digest
        if not blob.exists():
            blob.write_bytes(raw)
        self.stamps[path] = (stat.st_mtime_ns, stat.st_size, digest)
        return digest


def main(argv: list[str]) -> int:
    recorder = Recorder(Path(argv[0]), Path(argv[1]))
    while True:
        recorder.poll()
        time.sleep(POLL)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
