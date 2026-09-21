from controllers.types import Facts
from features import trigger
from features.base import Recital


class FactsFeature(Recital):
    name = "facts"
    aliases = ("pins",)
    runs_for_subagents = True
    controller = Facts
    title_ = "Facts"
    abstract_ = "What is true about the environment, said again to the agent as the window fills"
    help_ = "A fact is something a later reader would get wrong without; it is handed back at every tenth of the context. A fact or rule can carry keywords, a list of words set with --set keywords. When a command the agent is about to run, or text it is about to write, carries one of them, the row is whispered to that session once, with its reasoning; the call itself is never refused."
    trigger = {"every": 10, "unit": trigger.PERCENT}
