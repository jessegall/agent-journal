from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails
from features.recital import BEHAVIOURS, LINES


class RemindersDetails(FeatureDetails):
    name = "reminders"
    when = "you keep forgetting something, or leave an instruction for another agent"

    title = "Reminders"

    abstract = "The standing reminders said again to the agent when it comes to rest after work"

    help = """
        A reminder belongs to this environment. When you keep forgetting to do something you already know, write a
        reminder: journal reminder create "<what to do>".
        It is said again every quarter of the context window, so a long session hears it about four times; Settings can change
        the cadence to every n percent, uses or minutes, or to idle, worked or start.

        To remind only one session, add --set whom=<session>: it is said to that session alone and stays out of the start
        block. Use it to remind yourself, or to leave an instruction for an agent you are about to dispatch. Retire one that is
        no longer needed with journal reminder retire <n>.
    """

    trigger = Trigger(every=25, unit=PERCENT)

    lines = LINES

    behaviours = BEHAVIOURS
