from controllers.types import Reminders
from features import trigger
from features.base import Recital


class RemindersFeature(Recital):
    name = "reminders"
    controller = Reminders
    title_ = "Reminders"
    abstract_ = "The standing reminders said again to the agent when it comes to rest after work"
    help_ = "Said again every tenth of the context window, so a long session hears them a handful of times. Settings sets the cadence: every n percent, uses or minutes, or on idle, worked or start. A reminder written with --set whom=<session> is said to that session alone and stays out of the start block, which is how an agent reminds itself of something it keeps forgetting, or leaves one for the agent it is about to dispatch."
    trigger = {"every": 10, "unit": trigger.PERCENT}
