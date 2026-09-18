from features import trigger
from features.base import Recital


class Reminders(Recital):
    name = "reminders"
    type = "reminder"
    title_ = "Reminders"
    abstract_ = "The standing reminders said again to the agent when it comes to rest after work"
    help_ = "Said at an idle that follows tool use, not at every stop: three replies in a row hear them once. Set triggers.reminders to {every, unit} or {on} to change it."
    trigger = {"on": trigger.WORKED}
