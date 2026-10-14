from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Checks(Feature):
    name = "checks"
    title = "Checks"

    FAILED = Nudge(name, "failed", "check {{n}}, {{title}}, failed: {{tail}}")
    FAILING = Nudge(name, "failing", "check {{n}} is failing again")
    nudges = (FAILED, FAILING)
