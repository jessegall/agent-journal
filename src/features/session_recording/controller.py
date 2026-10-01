import os
import shutil
import signal
import subprocess
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Agents
from engine.package import entry
from engine.record import Record
from features.session_recording.resource import Recording
from resources.base import SYSTEM, Refused, titled


def alive(pid: int) -> bool:
    if pid <= 0:
        return False
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


class Recordings(Controller):
    resource = Recording

    def start(self, folder: str) -> str:
        target = Path(folder)
        if not target.is_absolute():
            raise Refused(f"give the folder's full path, not {folder!r}")
        if self._running():
            raise Refused(f"already recording into {self._running().folder}: journal record stop")
        target.mkdir(parents=True, exist_ok=True)
        child = subprocess.Popen([*entry("features.session_recording.recorder"), str(self.record.root.resolve()), str(target)],
                                 start_new_session=True, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        row = self.create(titled(f"Recording into {target.name}"), folder=str(target), pid=child.pid)
        return f"recording into {target} as record {row.n}; journal record stop ends it"

    def stop(self) -> str:
        row = self._running()
        if not row:
            raise Refused("nothing is being recorded: journal record start <folder>")
        try:
            os.kill(row.pid, signal.SIGTERM)
        except ProcessLookupError:
            pass
        copied = self._transcribed(Path(row.folder))
        self.complete(row.n, f"recorded into {row.folder} with {copied} transcripts")
        return f"recording stopped; {copied} transcripts copied into {row.folder}/transcripts"

    def _running(self):
        return next((row for row in self.all() if alive(row.pid)), None)

    def _transcribed(self, folder: Path) -> int:
        into = folder / "transcripts"
        copied = 0
        for home in sorted((self.record.root / "environments").iterdir()):
            for agent in Agents(Record(self.record.root, home.name), actor=SYSTEM).all():
                source = Path(agent.transcript) if agent.transcript else None
                if source and source.is_file():
                    into.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(source, into / f"{home.name}-{agent.title}{source.suffix}")
                    copied += 1
        return copied


resources_module.register(Recording)
types_module.register(Recordings)
