from features.base import Behaviour, FeatureDetails, Line
from features.trigger import NOTICES, Trigger

SHOP, REMIND = "shop", "remind"


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

        A message that only needs acknowledging, such as "ok", "thanks", "carry on" or a nod, gets a
        reaction instead of written words: journal message react <n> "👍", or 🙏 for thanks. A
        reaction can sit beside a reply or a filed to-do when both fit; write words only when
        there is something to say.

        A line from the journal is an instruction to you, never a message to answer: act on it,
        or note it and carry on, and never answer it or mention it in the chat. When a turn only
        handles a journal line, keep its text out of the chat with [!internal]. Use judgement:
        anything the user needs to know, such as a failure, a finished piece of work or a
        decision that waits on them, still goes to the chat in plain words, so nothing that
        matters is hidden.

        If you describe the journal's workings in the chat anyway, the journal tells you once,
        quoting the words that did it; and every 20 journal lines you are reminded of this
        (Settings can change the count).
    """

    primary = True

    behaviours = [
        Behaviour(
            name=REMIND,
            title="Remind the agent of chat etiquette every few journal lines",
            abstract="A line from the journal is acted on or noted, never answered or mentioned in the chat",
            trigger=Trigger(every=20, unit=NOTICES),
        ),
    ]

    lines = [
        Line(
            name=REMIND,
            title="chat etiquette - a line from the journal is an instruction, not a message: act on it or note it, never answer or mention it in the chat",
            brief="keep a turn that only handles a journal line out of the chat with [!internal]; what the user needs to know still goes to the chat",
        ),
        Line(
            name=SHOP,
            title='your chat talked about the journal\'s workings - "{{words}}"',
            brief="the user sees replies, reactions, pills and reads themselves; say what the work is instead",
        ),
    ]
