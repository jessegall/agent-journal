from dataclasses import dataclass

from engine.enums.script_stop import ScriptStop


@dataclass(frozen=True)
class ScriptEnd:
    """How a plugin's script ended: what it printed, its exit code, the end of its error output and why it was
    stopped, if it was."""

    output: str
    exit_code: int
    error_tail: str
    stop_reason: ScriptStop

    @property
    def is_stopped(self) -> bool:
        return self.stop_reason is not ScriptStop.STOP_FAILED
