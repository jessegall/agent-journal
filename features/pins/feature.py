from features import trigger
from features.base import Recital


class PinsFeature(Recital):
    name = "pins"
    type = "pin"
    title_ = "Pins"
    abstract_ = "The environment's pins said again to the agent at every tenth of the context"
    help_ = "A pin is a fact a later reader would get wrong without; it is handed back as the window fills."
    trigger = {"every": 10, "unit": trigger.PERCENT}
