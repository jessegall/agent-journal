from features.trigger import IDLE
from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting


class QuestionsDetails(FeatureDetails):
    name = "questions"

    title = "Questions"

    abstract = """
        A decision only the user can make is asked as a question, never offered in prose, and
        the answer they pick is held for a moment before it is saved
    """

    help = """
        A question or a suggestion is answered by clicking a choice; the choice is held for a
        moment before it is saved, and clicking it again in that moment takes it back.
        questions.hold sets the moment in seconds, three by default.

        A message with two or more listed options and a question, or the language of putting a
        decision to the user, tells the agent to use journal question ask --set options=…; its
        writes wait until a question is created. A line naming a question by number points at
        one already asked and does not count.
    """

    fixed = True

    aliases = (("choices", "asking"),)

    settings = [
        Setting(
            name="hold",
            default=3,
            title="Hold a picked answer",
            abstract="Click the same answer again within this time to cancel it",
            unit="seconds",
        ),
    ]

    behaviours = [
        Behaviour(
            name="asking",
            title="Ask through a question, not in prose",
            abstract="Choices offered in a message hold the writes until they are asked as a question",
            trigger={"on": IDLE},
        ),
    ]

    lines = [
        Line(
            name="prose",
            title="your last message offers choices in prose",
            brief="""
                ask through journal question ask "<one line>" --set options='[{"title": …,
                "description": …}]' --set pick=<n>, so the viewer renders it; your writes wait
                until you do
            """,
        ),
        Line(
            name="prose held",
            title="""
                your last message offered the user choices in prose: ask them through journal
                question ask --set options=… before any other write
            """,
        ),
    ]
