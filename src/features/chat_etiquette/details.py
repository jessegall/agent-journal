from features.base import FeatureDetails, Line

SHOP = "shop"


class ChatEtiquetteDetails(FeatureDetails):
    name = "chat_etiquette"
    when = "you write anything the user will read in the chat"

    title = "Chat etiquette"

    speaks_while_waiting = True

    abstract = "How the agent talks in the chat: about the work, never about the journal's own workings"

    help = """
        The user sees every reply, reaction, pill, question, to-do and whether a message is read
        or processed, so the chat never tells them: no "your message is answered", "I replied",
        "filed it as a pill" or "marked it read". A message arriving and your reading it are
        never mentioned either: no "a new message came in", "reading it first". Nor does it
        narrate the journal: its nudges, hooks, holds and skill loads stay out of the chat. A
        reaction from the user is acted on when it asks for something, such as a go-ahead, and
        never answered or mentioned: no "you reacted". The state of the record is not news
        either: no "nothing is open on my side", "nothing else is waiting". Say what the work
        is and what it came to, in plain words, and name every row with its type, such as to-do 12.

        Filing a to-do from a message does not answer it. When the message asks you something or
        proposes a way to do it ("maybe do it this way"), reply as well: say whether you agree and
        why, or what you would do instead, and when it will happen. Filing only is enough for a
        message that hands over work and asks nothing.

        A turn that talks about the journal's workings is named back to you once, with
        the words that gave it away.
    """

    primary = True

    lines = [
        Line(
            name=SHOP,
            title='your chat talked about the journal\'s workings - "{{words}}"',
            brief="the user sees replies, reactions, pills and reads themselves; say what the work is instead",
        ),
    ]
