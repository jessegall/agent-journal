from features.base import FeatureDetails
from features.groups import Group
from features.settings import Setting


class NudgesDetails(FeatureDetails):
    explains = "The journal sends the agent short instructions by itself, and asks again every few minutes until the agent acts on one."
    name = "nudges"
    group = Group.AGENT
    label = "Instructions the journal sends the agent"
    hint = "One that asks the agent to act is said again until it does"
    has_skill = False

    title = "Agent instructions"

    abstract = """
        A line that asks the agent to act, such as the next to-do, a message to answer or a helper's
        report, is said again every few minutes until the agent acts on it.
    """

    help = """
        Some of the lines the journal sends the agent ask it to do something: start the next to-do,
        answer a message, read and finish a helper's report, carry on with work that stands still,
        act on a question you answered, or look at a helper that stopped. Each such line is said
        again after the minutes set here, for as long as the agent has not acted on it. Set it to 0
        to say each line once and never again.

        Acting on it ends the repeat: starting work, answering the message, finishing the helper.
        So does its subject going away: the to-do closed, blocked or waiting on a question, the
        helper stopped or finished, or the agent session it was said to ended. A newer line about
        the same thing takes the place of the older one, and nothing is said again while the agent
        waits on something outside its hands.
    """

    fixed = True

    settings = [
        Setting(
            name="every",
            default=5,
            title="Ask again after",
            unit="minutes",
        ),
    ]
