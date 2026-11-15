from engine.driver.count_down import CountDown
from engine.driver.time_window import TimeWindow

# a step request is tried quickly this often; after that it waits RETRY_DELAY_SECONDS between tries
QUICK_TRIES, RETRY_DELAY_SECONDS = 3, 60
STEP_REQUEST_FAILURES = CountDown("drivers.step_request_failures", "step request {subject}", TimeWindow(QUICK_TRIES), is_silent=True)
