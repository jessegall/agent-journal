import os
import shutil
import signal
from pathlib import Path

from controllers.base import Controller
from controllers.agents import Agents
from engine.package import entry
from engine.record import Record
from controllers.session_recording.demo import leaks, scrubbed
from resources.session_recording import Recording
from engine.sessions import alive
from controllers.session_recording.scrub import Scrubber
from resources.base import SYSTEM, Refused, titled
from controllers.marks import action


class Recordings(Controller):
    resource = Recording

    @action
    def start(self, folder: str) -> str:
        target = Path(folder)
        if not target.is_absolute():
            raise Refused(f"give the folder's full path, not {folder!r}")
        if self._running():
            raise Refused(f"already recording into {self._running().folder}: journal record stop")
        target.mkdir(parents=True, exist_ok=True)
        pid = self.processes.apart_into([*entry("features.session_recording.recorder"), str(self.record.root.resolve()), str(target)],
                                        self.record.root / "runtime" / "recorder.log")
        row = self.create(titled(f"Recording into {target.name}"), folder=str(target), pid=pid)
        return f"recording into {target} as record {row.n}; journal record stop ends it"

    @action
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

    @action
    def scrub(self, folder: str) -> str:
        target = Path(folder)
        scrubber = Scrubber()
        scrubbed(target, scrubber)
        still = leaks(target, scrubber)
        if still:
            raise Refused("the recording still holds the machine: " + "; ".join(still[:5]))
        return f"{target} holds nothing about this machine"

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


