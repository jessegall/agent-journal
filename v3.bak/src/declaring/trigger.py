import json
from dataclasses import asdict, dataclass

from resources.fields import Loaded
from resources.base import names

PERCENT, USES, MINUTES, IDLE, WORKED, START, NOTICES = "percent", "uses", "minutes", "idle", "worked", "start", "notices"
UNITS = (PERCENT, USES, MINUTES, IDLE, WORKED, START, NOTICES)
TRIGGER = names("unit", "on", "every", "at")
MINUTE = 60.0
DAY = 24 * 60 * MINUTE


@dataclass(frozen=True)
class Trigger(Loaded):
    unit: str = ""
    every: float = 0
    at: tuple = ()
    on: str = ""

    def __bool__(self) -> bool:
        return bool(self.unit or self.on)

    def described(self) -> dict:
        return {key: list(value) if key == TRIGGER.at else value for key, value in
                ((TRIGGER.unit, self.unit), (TRIGGER.every, self.every), (TRIGGER.at, self.at), (TRIGGER.on, self.on)) if value}


@dataclass(frozen=True)
class Mark(Loaded):
    context: float = 0.0
    uses: int = 0
    status: str = ""
    event: str = ""
    at: float = 0.0
    count: int = 0
    edits: int = 0
    since: float = 0.0
    notified: bool | None = None
    notices: int = 0
    viewer_opened: bool = False

    @classmethod
    def staged(cls, name: str, **fields) -> dict:
        """The mark file an agent's trigger of this name leaves, as an expectation stages it before the registration runs."""
        return {f".journal/runtime/sessions/claude-1/trigger-{name}.json": json.dumps(asdict(cls(**fields)))}


NEVER = Trigger()


