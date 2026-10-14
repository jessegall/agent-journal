from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Laws(Feature):
    name = "laws"
    title = "Journal laws"

    NO_MODEL = Nudge(name, "no_model", "the dispatch names no model: name the least expensive that fits")
    NO_JOB = Nudge(name, "no_job", "the dispatch binds the agent to no concrete job")
    LONG_READ = Nudge(name, "long_read", "a whole read of {{lines}} lines was refused: read the range you need")
    LARGE_RESULT = Nudge(name, "large_result", "the result was {{lines}} lines: cap it next time")
    nudges = (NO_MODEL, NO_JOB, LONG_READ, LARGE_RESULT)
