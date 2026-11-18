from journal.engine.nudge import Nudge
from journal.support.timeout import Timeout


class ChecksNudges:
    CHECK_FAILED = Nudge("checks", "check_failed", "check {{n}} failed", "{{tail|cap=800}}", repeat=Timeout.seconds(0), longest_characters=830, longest_reason="it contains the end of the failing check's output")
    CHECK_COULD_NOT_RUN = Nudge("checks", "check_could_not_run", "check {{n}} could not run", "{{tail|cap=800}}", repeat=Timeout.seconds(0), longest_characters=837, longest_reason="it contains the end of the check's output")
    CHECK_FAILURE_REPEAT = Nudge("checks", "check_still_failing", "check {{n}} still failing", "{{tail|cap=800}}", repeat=Timeout.seconds(0), longest_characters=837, longest_reason="it contains the end of the failing check's output")
