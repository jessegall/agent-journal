from features import trigger
from features.base import Recital


class Reminders(Recital):
    name = "reminders"
    type = "reminder"
    title_ = "Reminders"
    abstract_ = "The standing reminders said again to the agent, on idle by default"
    help_ = "Set triggers.reminders to {every, unit} or {on} to change when they are said."
    trigger = {"on": trigger.IDLE}
