from engine.gates import Stops
from features.base import Behaviour, FeatureDetails, Line
from features.messages.answering import still_unanswered
from features.settings import Setting
from features.trigger import IDLE, Trigger, USES
from features.groups import Group


class MessagesDetails(FeatureDetails):
    explains = 'You can leave the agent a message in the viewer. The agent reads and answers it in the chat.'
    name = "messages"
    group = Group.MESSAGES
    when = "the user has left a message, or before replying, reacting or filing what a message asks for"

    title = "Messages"

    speaks_while_waiting = True

    abstract = """
        The agent is reminded of your messages until it reads them, answers each one before it goes
        on, and closes it once it is handled.
    """

    help = """
        To hand the user a document, or any row, put its reference on a line of its own, such as doc 41: the chat shows it as a
        card they can open.

        Each new message is named to you as it arrives. The inbox reminder follows only while more than five wait unread, or once
        you are idle: at your next tool use and at every third one after; after five reminders your writes are held. A message you have read and not
        answered holds every tool use at once, reading as much as writing, until you reply, react or process it; only a journal command that answers it goes through.
        It is also named back to you once it has waited ten tool uses, or once you are idle, a few times.
        A reply, a reaction, or processing every part closes it; a message you wrote closes as soon as the user has seen it.
        A row you file from a message is linked to it by journal message process, or by naming it in your reply while it is new.
    """

    aliases = (("inbox", "unread"), ("handled", "closing"), ("status", "answering"))

    behaviours = [
        Behaviour(
            name="unread",
            title="Remind the agent of unread messages",
            trigger=Trigger(every=3, unit=USES),
        ),
        Behaviour(
            name="answering",
            title="Make the agent answer a message before it changes files",
            trigger=Trigger(every=10, unit=USES),
        ),
        Behaviour(
            name="closing",
            title="Close a message once it is answered",
        ),
        Behaviour(
            name="paragraphs",
            title="Remind the agent to keep paragraphs apart",
            trigger=Trigger(on=IDLE),
        ),
        Behaviour(
            name="numbers",
            title="Remind the agent to say what a number is",
            abstract="answered 1712 becomes answered message 1712",
        ),
    ]

    settings = [
        Setting(
            name="unread.patience",
            default=5,
            title="Block file changes after this many reminders",
            unit="times",
            under="unread",
        ),
        Setting(
            name="answering.hold",
            default=0,
            title="Hold the agent's tool calls after this many tool uses with a message unanswered",
            unit="uses",
            under="answering",
        ),
        Setting(
            name="answering.patience",
            default=3,
            title="Stop reminding after",
            under="answering",
            unit="times",
        ),
    ]

    lines = [
        Line(
            name="reaction",
            title="your message was only {{face}}, so it was not posted - react instead",
            brief="""
                a face on its own is a reaction: journal message react <n> "{{face}}" puts it on the
                message it answers. Write words when there is something to say.
            """,
        ),
        Line(
            name="inbox",
            title="there are new messages in your inbox",
            brief="journal message unread, then journal message read <n> for each",
        ),
        Line(
            name="inbox held",
            title="your inbox is unread: journal message unread, then journal message read <n> for each, before any other write",
        ),
        Line(
            name="answer",
            title="answer {{messages}} before you do anything else",
            until=("message.completed",),
            owed=still_unanswered,
            brief="a reply, a reaction, or journal message processed <n>",
        ),
        Line(
            name="answer held",
            title="your tool calls are held: answer {{messages}} first",
            brief="a reply, a reaction, or journal message processed <n>",
            scope=Stops.EVERYTHING,
        ),
        Line(
            name="paragraphs",
            title="your last message ran its paragraphs together",
            brief="a blank line between parts is what makes a message readable: one thought to a paragraph",
        ),
        Line(
            name="numbers",
            title="your message {{n}} names {{numbers}} without saying what they are",
            brief='put the type before each number, like message 1712 or to-do 644, so the chat links it: journal message edit {{n}} "<the text>"',
        ),
    ]
