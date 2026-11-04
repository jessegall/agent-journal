from enum import Enum

from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


MODULE_KEY = "journal.core.processes"


class ProcessSetting(Enum):
    """A setting of the processes module, declared once: its full key and its default come from its
    declaration."""

    FOREGROUND_SECONDS = SettingValue("foreground-seconds", "Seconds in the foreground", "Seconds a command runs in the foreground before continuing in the background.",
                                      SettingType.NUMBER, default=15)
    READER_BLOCK_MINUTES = SettingValue("reader-block-minutes", "Minutes to wait for a reader", "How long an agent waits for a proper reader. Runs start after at most 30 minutes even with a longer block.", SettingType.NUMBER, default=25)
    READER_SAVE_TRIES = SettingValue("reader-save-tries", "Reader save tries", "Failed reader saves allowed before the main agent is asked to help. Zero asks the main agent immediately.", SettingType.NUMBER, default=3)
    READERS_FORCED = SettingValue("readers-forced", "Require output readers", "Pause agents whose commands have no usable output reader.", SettingType.FLAG, default=True)
    WAITING_FOREGROUND_SECONDS = SettingValue("foreground-while-waiting", "Seconds while a message waits",
                                              "Seconds a command runs in the foreground while your message is waiting.", SettingType.NUMBER, default=10)
    ORPHAN_SECONDS = SettingValue("orphan-seconds", "Run inactivity limit (seconds)", "Seconds without activity before a run is marked as lost.",
                                  SettingType.NUMBER, default=90)
    RUN_BATCH_SIZE = SettingValue("run-batch-size", "Runs at once", "How many queued runs go at once on this machine; the others wait for a spot. Reads and edits never wait.",
                                  SettingType.NUMBER, default=2)
    MAIN_RUNS_USE_SLOTS = SettingValue("main-runs-take-slots", "Main agent runs take spots", "When on, the main agent's runs count against the runs at once, so fewer queued runs start; none is ever stopped.",
                                        SettingType.FLAG, default=False)
    OUTPUTS_KEPT_COUNT =SettingValue("outputs-kept", "Outputs kept", "How many outputs are kept before the oldest are removed.", SettingType.NUMBER, default=40)
    OUTPUTS_KEPT_MINUTES = SettingValue("outputs-kept-minutes", "Minutes an output is kept", "How long an output that ended is kept, whatever the number of outputs.", SettingType.NUMBER, default=30)
    SHORT_OUTPUT_BYTES = SettingValue("short-output", "Short output bytes", "Outputs smaller than this many bytes are shown in full without being saved.", SettingType.NUMBER,
                                      default=200)

    MOST_OUTPUT_MEGABYTES = SettingValue("most-output-megabytes", "Output storage limit (MB)", "How many megabytes of one command's output stay on disk; past this the oldest lines go.",
                                         SettingType.NUMBER, default=10)
    MOST_TEST_OUTPUT_MEGABYTES = SettingValue("most-test-output-megabytes", "Test output storage limit (MB)", "How many megabytes of one test or build output stay on disk; past this the oldest lines go.",
                                              SettingType.NUMBER, default=100)
    LARGE_OUTPUT_LINES = SettingValue("large-output-lines", "Large output lines", "When an output exceeds this many lines, suggest options for reading a shorter section.", SettingType.NUMBER,
                                      default=100)

    @property
    def key(self) -> str:
        return f"{MODULE_KEY}.{self.value.key}"

    @property
    def default(self) -> int:
        default = self.value.default
        return default if isinstance(default, int) and not isinstance(default, bool) else 0


PROCESS_SETTINGS = [setting.value for setting in ProcessSetting]
