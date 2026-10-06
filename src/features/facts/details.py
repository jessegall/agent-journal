from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails
from features.recital import LINES, whispering
from features.groups import Group


class FactsDetails(FeatureDetails):
    explains = 'The journal repeats relevant facts about this environment to the agent. You can edit or close a fact when it changes.'
    name = "facts"
    group = Group.MEMORY
    label = "Remind the agent of facts"
    skill_of = "memory"
    when = "you learn something a later session would get wrong without, or at a context mark"

    title = "Remind the agent of facts"

    abstract = "Facts about this environment are repeated to the agent as its context fills."

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

    behaviours = whispering("fact")
