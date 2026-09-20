from controllers.types import Pins
from features import trigger
from features.base import Recital


class PinsFeature(Recital):
    name = "pins"
    controller = Pins
    title_ = "Pins"
    abstract_ = "The environment's pins said again to the agent at every tenth of the context"
    help_ = "A pin is a fact a later reader would get wrong without; it is handed back as the window fills. A pin or rule can carry keywords, a list of words set with --set keywords. When a command the agent is about to run, or text it is about to write, carries one of them, the row is whispered to that session once, with its reasoning; the call itself is never refused."
    trigger = {"every": 10, "unit": trigger.PERCENT}
