from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails
from features.recital import LINES, whispering
from features.groups import Group


class RemindersDetails(FeatureDetails):
    explains = 'The journal repeats your standing reminders to the agent. You can change or close them in the viewer.'
    name = "reminders"
    group = Group.MEMORY
    label = "Repeat reminders"
    skill_of = "memory"
    when = "you keep forgetting something, or leave an instruction for another agent"

    title = "Repeat reminders"

    abstract = "Your standing reminders are repeated to the agent when it stops after working."

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

    behaviours = whispering("reminder")
