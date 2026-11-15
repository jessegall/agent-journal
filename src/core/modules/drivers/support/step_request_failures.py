from engine.driver.count_down import CountDown
from engine.driver.times_span import TimesSpan

# a step request is tried quickly this often; after that it waits RETRY_DELAY_SECONDS between tries
QUICK_TRIES, RETRY_DELAY_SECONDS = 3, 60
STEP_REQUEST_FAILURES = CountDown("drivers.step_request_failures", "step request {subject}", TimesSpan(QUICK_TRIES), is_silent=True)
