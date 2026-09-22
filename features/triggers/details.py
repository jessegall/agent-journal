from features.base import Behaviour, FeatureDetails, Line
from features.triggers.resource import DOES


class TriggersDetails(FeatureDetails):
    name = "triggers"

    title = "Triggers"

    abstract = "Words the user watches for, and what the journal does when they come up"

    help = f"""
        journal trigger create "<what it is for>" --set words="git push,force" --set
        does=nudge --set text="<what to say>" writes one. words_in says where the words are
        matched: text, commands, both (the default) or everything.

        does is one of {', '.join(DOES)}. A message reaches the chat as if the user wrote it, a
        nudge and an instruction are said to the agent alone, and a deny refuses the tool call
        with the trigger's text as the reason.
    """

    behaviours = [
        Behaviour(
            name="watching",
            title="Fire a trigger when one of its words comes up",
            abstract="In what the agent writes or runs, and in what the user writes to it",
        ),
    ]

    lines = [
        Line(
            name="nudge",
            title="{{title}}",
            brief="{{text}}",
        ),
        Line(
            name="instruct",
            title="do this now: {{title}}",
            brief="{{text}}",
        ),
    ]
