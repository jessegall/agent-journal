import json
from dataclasses import fields
import os
import time as timing
from dataclasses import asdict

from journal.config import Config
from journal.features.updates.support.update_pause import UpdatePause
from journal.support.rejection import Rejection

FIRST_STEP = "Installing the new version"


class UpdateCard:
    """The marker file an update keeps while it runs: no second update starts beside it, the viewer's cover stays up through the restart, and the journal that comes up after it knows how it ended."""

    def __init__(self, config: Config) -> None:
        self.path = config.home / "runtime" / "updating.json"

    def claim(self, previous: str, destination: str) -> None:
        blocked = self.paused()
        if blocked is not None and not blocked.is_stale(timing.time()):
            raise Rejection(f"an update to {blocked.target} is under way since {timing.strftime('%H:%M', timing.localtime(blocked.time))}")
        self.write(UpdatePause(previous, destination, FIRST_STEP, timing.time(), os.getpid()))

    def step(self, step: str) -> None:
        blocked = self.paused()
        if blocked is not None:
            self.write(blocked.step_pause(step))

    def paused(self) -> UpdatePause | None:
        if not self.path.is_file():
            return None
        data = json.loads(self.path.read_text())
        if set(data) != {f.name for f in fields(UpdatePause)}:
            self.path.unlink()
            return None
        return UpdatePause(**data)

    def clear(self) -> None:
        self.path.unlink(missing_ok=True)

    def write(self, blocked: UpdatePause) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        saved = self.path.with_suffix(".tmp")
        saved.write_text(json.dumps(asdict(blocked)))
        saved.replace(self.path)
