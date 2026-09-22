from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails
from features.recital import BEHAVIOURS, LINES


class FactsDetails(FeatureDetails):
    name = "facts"
    when = "you learn something a later session would get wrong without, or at a context mark"

    title = "Facts"

    abstract = "What is true about the environment, said again to the agent as the window fills"

    help = """
        A fact is something a later reader would get wrong without; it is handed back at every
        tenth of the context.

        A fact or rule can carry keywords, plain words set with --set keywords. When one of them
        comes up as a whole word, the row is whispered to that session once, with its
        reasoning; the call itself is never refused. --set keywords_in says where they match:
        text (what the agent writes, in edits and in the chat), commands (shell commands), both
        (the default), or everything (any tool call, file paths, searches and URLs included).
    """

    aliases = ("pins",)

    runs_for_subagents = True

    trigger = Trigger(every=10, unit=PERCENT)

    lines = LINES

    behaviours = BEHAVIOURS
