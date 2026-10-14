from declaring.details import FeatureDetails
from framework.recital import LINES, whispering
from declaring.groups import Group


class RemindersDetails(FeatureDetails):
    explains = 'The journal repeats your standing reminders to the agent. You can change or close them in the viewer.'
    name = "reminders"
    group = Group.MEMORY
    label = "Repeat reminders to the agent"
    skill_of = "memory"
    when = "you keep forgetting something, or leave an instruction for another agent"

    title = "Reminders"

    abstract = "Your standing reminders are handed to the agent when a session starts and after each compaction."

    help = """
        A reminder belongs to this environment. When you keep forgetting to do something you already know, write a
        reminder: journal reminder create "<what to do>".
        It is said when a session starts and after each compaction; Settings can change
        the cadence to every n percent, uses or minutes, or to idle, worked or start.

        To remind only one session, add --set whom=<session>: it is said to that session alone and stays out of the start
        block. Use it to remind yourself, or to leave an instruction for an agent you are about to dispatch. Retire one that is
        no longer needed with journal reminder retire <n>.
    """


    lines = LINES

    behaviours = whispering("reminder")
