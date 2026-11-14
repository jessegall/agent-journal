import threading
import time

from engine.time.clock import Clock


class SampleWaits:
    def __init__(self, clock: Clock, worker: threading.Thread) -> None:
        self.clock, self.worker = clock, worker

    def pause(self) -> None:
        # @sin architecture_core_wait_outside_the_wait_doors
        time.sleep(1)

    def end(self) -> None:
        # @sin architecture_core_wait_outside_the_wait_doors
        self.worker.join(5)

    def door_pause(self) -> None:
        # @righteous architecture_core_wait_outside_the_wait_doors
        self.clock.sleep(1)
