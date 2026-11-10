import subprocess
from dataclasses import dataclass

from engine.enums.event_form import EventForm
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class PluginScriptProcess:
    """A running plugin script and the event it handles."""

    process: "subprocess.Popen[str]"
    plugin: str
    key: str
    form: EventForm
    started_at: Timestamp


RunningScript = PluginScriptProcess
