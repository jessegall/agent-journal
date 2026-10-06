from features.base import FeatureDetails, Line
from features.groups import Group
from features.settings import Setting

UNLINKED = "unlinked"


class MessageTodosDetails(FeatureDetails):
    explains = 'A to-do the agent files from your message shows above that message. You can open it from there.'
    name = "message_todos"
    group = Group.MESSAGES
    label = "Link to-dos to the message they came from"
    hint = "A reply that names a new to-do links it to the message"
    has_skill = False

    title = "To-dos from messages"

    abstract = "A to-do named in the agent's reply is linked to the message it answers, and an unlinked one is pointed out."

    help = """
        When the agent replies to a message and the reply names a to-do filed in the last few
        minutes that no message links yet, the to-do is linked to that message and shows above it.
        A to-do filed after the message arrived that the reply leaves unnamed and unlinked is
        pointed out to the agent once, with the command that links it.
    """

    settings = [
        Setting(
            name="minutes",
            default=5,
            title="How new a to-do must be to link it",
            abstract="Only a to-do filed this many minutes before the reply is linked",
            unit="minutes",
        ),
    ]

    lines = [
        Line(
            name=UNLINKED,
            title="to-do {{todo}} came from message {{message}}?",
            brief='link it: journal message process {{message}} "<their words>" todo:{{todo}}',
        ),
    ]
