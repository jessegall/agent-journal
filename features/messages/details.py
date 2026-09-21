from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import IDLE, Trigger, USES


class MessagesDetails(FeatureDetails):
    name = "messages"

    title = "Messaging"

    abstract = """
        What the user leaves for the agent is named until it is read, answered before the work
        starts, and closed once it is dealt with
    """

    help = """
        Unread messages are named at the first tool use after one arrives and every third
        after; five times ignored, the writes are held. A message that has been read is named
        again before the next write, a few times, and never refused over.

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
            brief='journal message reply <n> "<what you make of it>", a reaction, or journal message processed <n>',
        ),
        Line(
            name="paragraphs",
            title="your last message ran its paragraphs together",
            brief="a blank line between parts is what makes a message readable: one thought to a paragraph",
        ),
    ]
