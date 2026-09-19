from features import trigger
from features.base import Recital


class RemindersFeature(Recital):
    name = "reminders"
    type = "reminder"
    title_ = "Reminders"
    abstract_ = "The standing reminders said again to the agent when it comes to rest after work"
    help_ = "Said again every tenth of the context window, so a long session hears them a handful of times. Settings sets the cadence: every n percent, uses or minutes, or on idle, worked or start."
    trigger = {"every": 10, "unit": trigger.PERCENT}
