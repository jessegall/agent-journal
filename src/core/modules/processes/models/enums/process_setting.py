from enum import Enum


class ProcessSetting(Enum):
    """A setting of the processes module: its key and what it is when no setting names it."""

    FOREGROUND_SECONDS = ("processes.foreground-seconds", 30)
    WAITING_FOREGROUND_SECONDS = ("processes.foreground-while-waiting", 10)
    UNREAD_OUTPUT_TOOL_USES = ("processes.unread-output-every", 5)
    ORPHAN_SECONDS = ("processes.orphan-seconds", 90)
    OUTPUTS_KEPT_COUNT = ("processes.outputs-kept", 40)
    SHORT_OUTPUT_BYTES = ("processes.short-output", 200)

    @property
    def key(self) -> str:
        return self.value[0]

    @property
    def default(self) -> int:
        return self.value[1]
