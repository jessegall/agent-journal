from enum import Enum

from engine.enums.setting_type import SettingType
from engine.setting.number_rule import NumberRule
from engine.setting.setting_value import SettingValue


MODULE_KEY = "journal.core.processes"


class ProcessSetting(Enum):
    """A setting of the processes module, declared once: its full key and its default come from its
    declaration."""

    FOREGROUND_SECONDS = SettingValue("foreground-seconds", "Seconds in the foreground", "Seconds a command runs in the foreground before continuing in the background.",
                                      SettingType.NUMBER, default=15)
    READER_BLOCK_MINUTES = SettingValue("reader-block-minutes", "Minutes to wait for a reader", "How long an agent waits for a proper reader. Runs start after at most 30 minutes even with a longer block.", SettingType.NUMBER, default=25)
    READER_SAVE_TRIES = SettingValue("reader-save-tries", "Reader save tries", "Failed reader saves allowed before the main agent is asked to help. Zero asks the main agent immediately.", SettingType.NUMBER, default=3)
    READERS_FORCED = SettingValue("readers-forced", "Require output readers", "Pause agents whose commands have no usable output reader.", SettingType.FLAG, default=True, person_set=True)
    WAITING_FOREGROUND_SECONDS = SettingValue("foreground-while-waiting", "Seconds while a message waits",
                                              "Seconds a command runs in the foreground while your message is waiting.", SettingType.NUMBER, default=10)
    QUEUE_WAIT_SECONDS = SettingValue("queue-wait-seconds", "Seconds to wait for a run slot",
                                     "Seconds a queued command waits before continuing in the background.", SettingType.NUMBER, default=5)
    ORPHAN_SECONDS = SettingValue("orphan-seconds", "Run inactivity limit (seconds)", "Seconds without activity before a run is marked as lost.",
                                  SettingType.NUMBER, default=90)
    LOST_RUNNER_SECONDS = SettingValue("lost-runner-seconds", "Seconds before a run is lost", "Seconds after the last sign of a run whose runner process is gone before the run is marked as lost.",
                                       SettingType.NUMBER, default=10)
    DOCK_AFTER_SECONDS = SettingValue("dock-after-seconds", "Seconds before a run is docked", "Seconds a command runs, time in the queue left out, before it shows in the dock.",
                                      SettingType.NUMBER, default=5)
    HANG_SECONDS = SettingValue("hang-seconds", "Seconds before an idle run is stopped", "Seconds a run prints nothing and uses no processor time before it is stopped and its agent told.",
                                SettingType.NUMBER, default=300)
    LOOK_SECONDS = SettingValue("look-seconds", "Seconds before an agent is asked to look", "Seconds a test run prints nothing while it uses processor time before its agent is asked to read its output.",
                                SettingType.NUMBER, default=900)
    FIRST_OUTPUT_SECONDS = SettingValue("first-output-seconds", "Seconds before a silent run is reported", "Seconds a run may print nothing before its agent is told.",
                                        SettingType.NUMBER, default=30, rule=NumberRule(1))
    STOPPED_WRITING_SECONDS = SettingValue("stopped-writing-seconds", "Seconds a run may stop printing",
                                           "Seconds a run that printed may stay silent before its agent is told.", SettingType.NUMBER, default=120, rule=NumberRule(1))
    SPARSE_SECONDS = SettingValue("sparse-seconds", "Seconds between lines of a sparse run",
                                  "Average seconds between prints, over the last five, from which a run counts as printing too little.", SettingType.NUMBER, default=30,
                                  rule=NumberRule(1))
    RUN_BATCH_SIZE =SettingValue("run-batch-size", "Runs at once", "How many queued runs go at once on this machine; the others wait for a spot. Reads and edits never wait.",
                                  SettingType.NUMBER, default=2)
    MAIN_RUNS_USE_SLOTS = SettingValue("main-runs-take-slots", "Main agent runs take spots", "When on, the main agent's runs count against the runs at once, so fewer queued runs start; none is ever stopped.",
                                        SettingType.FLAG, default=False)
    PROCESSES_KEPT = SettingValue("processes-kept", "Ended commands kept",
                                 "How many ended commands each environment keeps, with at least one. Running commands stay.", SettingType.NUMBER, default=1000)
    REQUEST_RUN_DAYS = SettingValue("request-run-days", "Days requests are kept", "How many days each environment keeps the records of its hooks, journal commands and viewer requests, with at least one.",
                                    SettingType.NUMBER, default=14, rule=NumberRule(1))

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
