from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.features.usage.states.usage_limited import UsageLimited
from journal.features.usage.usage_conduct import UsageConduct
from journal.support.option import Option


class Usage(Feature):
    NAME = "usage"
    CHECK_MINUTES = Option("usage.check_minutes", "Minutes between limit checks", "While the agent's provider refuses its turns on a usage limit, the journal types nothing to it and tries one turn this often to see whether the limit is over", 15, unit="minutes")
    LIMIT_CHECK = Nudge(NAME, "limit_check", "checking whether the usage limit is over", "if it is, carry on with the work in hand", repeat_interval=0)

    name = NAME
    title = "Usage limits"
    fixed = True
    help = "When the agent's provider refuses its turns on a usage limit, the journal types nothing to it, types your messages at once, and tries a turn every so often until the limit is over."
    states = (UsageLimited,)
    conduct = (UsageConduct,)
    nudges = (LIMIT_CHECK,)
    options = (CHECK_MINUTES,)
