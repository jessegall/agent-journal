from features.base import FeatureDetails
from features.groups import Group
from features.settings import Setting


class RepeatUntilDoneDetails(FeatureDetails):
    explains = "When the journal asks the agent to do something, it asks again every few minutes until the agent does it."
    name = "repeat_until_done"
    group = Group.AGENT
    label = "Ask the agent again until it acts"
    hint = "Stops as soon as the agent does what it was asked"
    has_skill = False

    title = "Ask again until it is done"

    abstract = """
        A line that asks the agent to act, such as the next to-do, a message to answer or a helper's
        report, is said again every few minutes until the agent acts on it.
    """

    help = """
        Some of the lines the journal sends the agent ask it to do something: start the next to-do,
        answer a message, read and finish a helper's report, carry on with work that stands still,
        act on a question you answered, or look at a helper that went quiet or stopped. Each such
        line is said again after the minutes set here, for as long as the agent has not acted on it.

        Acting on it ends the repeat: starting work, answering the message, finishing the helper.
        A newer line about the same thing takes the place of the older one, so one line about it
        is ever repeated.
    """

    settings = [
        Setting(
            name="every",
            default=5,
            title="Ask again after",
            unit="minutes",
        ),
    ]
