import subprocess
from dataclasses import dataclass

from core.base.model.event_form import EventForm
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class RunningScript:
    """A plugin's program or script while it runs: its process, the plugin, the event key and form it runs for,
    and when it started."""

    process: "subprocess.Popen[str]"
    plugin: str
    key: str
    form: EventForm
    started_at: Timestamp
