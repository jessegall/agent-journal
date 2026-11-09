from core.base.clock import Clock
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_WAIT

POLL_SECONDS = 0.5


class WorkerTestWait:
    """Keeps a worker's named test on its call until the run ended or the wait is over, then asks a run still
    going to move to the background."""

    def __init__(self, folder: OutputFolder, clock: Clock, settings: SettingValues) -> None:
        self.folder, self.clock, self.settings = folder, clock, settings

    def exit_code(self, process_id: int) -> int | None:
        waited, wait = 0.0, self.settings.number(WORKER_RUN_WAIT)
        while (code := self.folder.end(process_id)) is None and waited < wait:
            self.clock.sleep(POLL_SECONDS)
            waited += POLL_SECONDS
        if code is None:
            self.folder.ask_move(process_id)
        return code
