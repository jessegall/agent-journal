from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails
from features.recital import BEHAVIOURS, LINES


class FactsDetails(FeatureDetails):
    name = "facts"
    when = "you learn something a later session would get wrong without, or at a context mark"

    title = "Facts"

    abstract = "What is true about the environment, said again to the agent as the window fills"

    help = """
        A fact belongs to this environment. When you learn something about it that a later session would get wrong without,
        write it as a fact:
        journal fact create "<the claim>" --brief "<why it is true, where it shows>". It is handed back at every quarter of the
        context. When it stops being true, strike it with journal fact strike <n> --how "<what changed>".

        Give it keywords with --set keywords="<word>,<word>": when one appears as a whole word, you are shown the
        row once, with its reasoning, and the tool call still goes through. --set keywords_in says where they match: text
        (what you write, in edits and in the chat), commands (shell commands), both (the default), or everything (any tool call,
        file paths, searches and URLs included).
    """

    aliases = ("pins",)

    trigger = Trigger(every=25, unit=PERCENT)

    lines = LINES

    behaviours = BEHAVIOURS
