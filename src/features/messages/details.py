from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import IDLE, Trigger, USES


class MessagesDetails(FeatureDetails):
    name = "messages"
    when = "the user has left a message, or before replying, reacting or filing what a message asks for"

    title = "Messaging"

    speaks_while_waiting = True

    abstract = """
        What the user leaves for the agent is named until it is read, answered before the work
        starts, and closed once it is dealt with
    """

    help = """
        Unread messages are named at the first tool use after one arrives and every third
        after; five times ignored, the writes are held. A message that has been read is named
        again before the next write, a few times, and never refused over.

        To hand the user a document, or any row, put its reference on a line of its own, such
        as doc 41: the chat shows it as a card they can open.

        A reply, a reaction, or processing every part closes it, and a message the agent wrote
        closes as soon as the user has seen it. Every row the agent files while a message is in
        its hands is linked to that message.
    """

    aliases = (("inbox", "unread"), ("handled", "closing"), ("status", "answering"))

    behaviours = [
        Behaviour(
            name="unread",
            title="Name the unread messages",
            abstract="Said at the first tool use after one arrives and every third after",
            trigger=Trigger(every=3, unit=USES),
        ),
        Behaviour(
            name="answering",
            title="Answer a message before writing",
            abstract="Said before the next write while a message sits read and unanswered",
            trigger=Trigger(every=1, unit=USES),
        ),
        Behaviour(
            name="closing",
            title="Close a message once it is dealt with",
            abstract="A reply, a reaction, every part processed, or the user reading what the agent wrote",
        ),
        Behaviour(
            name="linking",
            title="Link what is filed to the message in hand",
            abstract="A row the agent creates while a message is open cites that message",
        ),
        Behaviour(
            name="paragraphs",
            title="Keep the paragraphs of a message apart",
            abstract="A message of several sentences run together is named back once, at the end of the turn",
            trigger=Trigger(on=IDLE),
        ),
        Behaviour(
            name="numbers",
            title="Name what a number in a message is",
            abstract="A message that names a row by a bare number, like 'answered 1712', is named back so the type can be added and the chat links it; quoted text and code are left alone",
        ),
    ]

    settings = [
        Setting(
            name="unread.patience",
            default=5,
            title="Hold writes after the unread messages are named this often",
        ),
        Setting(
            name="answering.patience",
            default=3,
            title="Stop naming an unanswered message after",
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
            title="answer {{messages}} before you write anything",
            brief="a reply, a reaction, or journal message processed <n>",
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
