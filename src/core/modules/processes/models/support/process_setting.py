from enum import Enum

from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


MODULE_KEY = "journal.core.processes"


class ProcessSetting(Enum):
    """A setting of the processes module, declared once: its full key and its default come from its
    declaration."""

    FOREGROUND_SECONDS = SettingValue("foreground-seconds", "Seconds in the foreground", "How long a command runs in front before it moves to the background.",
                                      SettingType.NUMBER, default=15)
    WAITING_FOREGROUND_SECONDS = SettingValue("foreground-while-waiting", "Seconds while a message waits",
                                              "How long a command runs in front while a message of the user waits.", SettingType.NUMBER, default=10)
    ORPHAN_SECONDS = SettingValue("orphan-seconds", "Seconds to a lost run", "How long a run may go without a sign of life before it is ended as lost.",
                                  SettingType.NUMBER, default=90)
    RUN_BATCH_SIZE = SettingValue("run-batch-size", "Runs at once", "How many runs of workers go at the same time on this machine; the others wait in a queue. Reads and edits never wait.",
                                  SettingType.NUMBER, default=2)
    OUTPUTS_KEPT_COUNT = SettingValue("outputs-kept", "Outputs kept", "How many outputs are kept before the oldest are removed.", SettingType.NUMBER, default=40)
    OUTPUTS_KEPT_MINUTES = SettingValue("outputs-kept-minutes", "Minutes an output is kept", "How long an output that ended is kept, whatever the number of outputs.", SettingType.NUMBER, default=30)
    SHORT_OUTPUT_BYTES = SettingValue("short-output", "Short output bytes", "Below how many bytes an output is shown whole and not kept.", SettingType.NUMBER,
                                      default=200)

    @property
    def key(self) -> str:
        return f"{MODULE_KEY}.{self.value.key}"

    @property
    def default(self) -> int:
        default = self.value.default
        return default if isinstance(default, int) and not isinstance(default, bool) else 0


PROCESS_SETTINGS = [setting.value for setting in ProcessSetting]
