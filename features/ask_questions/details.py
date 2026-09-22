from features.trigger import IDLE, Trigger
from features.ask_questions.interceptors import FILED
from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting


class QuestionsDetails(FeatureDetails):
    name = "ask_questions"

    title = "Questions, not prose choices"

    speaks_while_waiting = True

    abstract = """
        A decision only the user can make is asked as a question, never offered in prose, and
        the answer they pick is held for a moment before it is saved
    """

    help = """
        A question or a suggestion is answered by clicking a choice; the choice is held for a
        moment before it is saved, and clicking it again in that moment takes it back.
        questions.hold sets the moment in seconds, three by default. The card marks the answer
        as the user's; when the agent answers a question itself, journal question answer <n>
        "<choice>" --set reason="<why>" is required, and the card shows the agent's answer with
        that reason beneath it.

        A message with two or more listed options and a question, or the language of putting a
        decision to the user, tells the agent to use journal question ask --set options=…; its
        writes wait until a question is created. A line naming a question by number points at
        one already asked and does not count.

        A question tool the provider offers, such as Claude Code's AskUserQuestion, never opens
        in the terminal: each question in the call is filed as a journal question with its
        options, and the call is refused with the numbers, so the agent carries on and hears the
        answer as an event.
    """

    fixed = True

    aliases = (("choices", "asking"), "questions")

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
            trigger=Trigger(on=IDLE),
        ),
    ]

    lines = [
        Line(
            name=FILED,
            title="asked in the journal as question {{numbers}}",
            brief="the user answers it in the viewer and the answer reaches you as an event; carry on with what does not depend on it",
        ),
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
