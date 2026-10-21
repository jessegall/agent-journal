import json
import os
import time
from dataclasses import asdict

from journal.config import Config
from journal.features.updates.support.update_held import UpdateHeld
from journal.support.refused import Refused

FIRST_STEP = "Installing the new version"


class UpdateMark:
    """The marker file an update keeps while it runs: no second update starts beside it, the viewer's cover stays up through the restart, and the journal that comes up after it knows how it ended."""

    def __init__(self, config: Config) -> None:
        self.path = config.home / "runtime" / "updating.json"

    def claim(self, before: str, to: str) -> None:
        held = self.held()
        if held is not None and not held.is_stale(time.time()):
            raise Refused(f"an update to {held.to} is under way since {time.strftime('%H:%M', time.localtime(held.at))}")
        self.write(UpdateHeld(before, to, FIRST_STEP, time.time(), os.getpid()))

    def step(self, step: str) -> None:
        held = self.held()
        if held is not None:
            self.write(held.at_step(step))

    def held(self) -> UpdateHeld | None:
        return UpdateHeld(**json.loads(self.path.read_text())) if self.path.is_file() else None

    def clear(self) -> None:
        self.path.unlink(missing_ok=True)

    def write(self, held: UpdateHeld) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        written = self.path.with_suffix(".tmp")
        written.write_text(json.dumps(asdict(held)))
        written.replace(self.path)
