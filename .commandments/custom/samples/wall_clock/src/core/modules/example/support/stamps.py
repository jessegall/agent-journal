import time
from datetime import datetime


def stamp(clock):
    # @sin architecture_core_wall_clock_outside_clock
    started = time.time()
    # @sin architecture_core_wall_clock_outside_clock
    moment = datetime.now()
    # @righteous architecture_core_wall_clock_outside_clock
    waited = time.monotonic()
    # @righteous architecture_core_wall_clock_outside_clock
    read = clock.timestamp()
    return started, moment, waited, read
