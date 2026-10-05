from features.base import Behaviour, FeatureDetails, Line
from features.trigger import NOTICES, Trigger
from features.groups import Group

SHOP, REMIND, SPOKEN_OF = "shop", "remind", "spoken_of"


class ChatEtiquetteDetails(FeatureDetails):
    name = "chat_etiquette"
    group = Group.AGENT
    label = "Keep journal talk out of the chat"
    position = 3
    when = "you write anything the user will read in the chat"

    title = "Keep journal talk out of the chat"

    speaks_while_waiting = True

    abstract = "In the chat the agent talks about the work, not about the journal's own commands and reminders."

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
        Speak to the user, never about them: "you asked", not "the user asks" or their name with
        "asks" or "wants", unless you are writing for someone else, as in a brief or a report.

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
        handles a journal line, it needs no words: act on it, or say once what you wait on, and
        carry on; a bare acknowledgement is kept out of the chat by the journal. Use judgement:
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
            title="Remind the agent to keep journal talk out of the chat",
            trigger=Trigger(every=20, unit=NOTICES),
        ),
    ]

    lines = [
        Line(
            name=REMIND,
            title="chat etiquette - a line from the journal is an instruction, not a message: act on it or note it, never answer or mention it in the chat",
            brief="""
                a turn that only handles a journal line needs no words: act on it, or say once in the chat what you
                wait on, then carry on; what the user needs to know still goes to the chat
            """,
        ),
        Line(
            name=SPOKEN_OF,
            title='your chat spoke about the user instead of to them - "{{words}}"',
            brief="you are talking to them: say \"you asked\" or \"you want\", and keep their name for addressing them",
        ),
        Line(
            name=SHOP,
            title='your chat talked about the journal\'s workings - "{{words}}"',
            brief="the user sees replies, reactions, pills and reads themselves; say what the work is instead",
        ),
    ]
