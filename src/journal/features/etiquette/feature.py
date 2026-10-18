from journal.features.etiquette.listeners.read_turn import ReadTurn
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.models.option import Option


class Etiquette(Feature):
    name = "etiquette"
    title = "Chat etiquette"
    help = "Shop talk and the third person in the chat are named."
    listeners = (ReadTurn,)

    SHOP_TALK = Nudge(name, "shop_talk", "your message talks about the journal's commands", "talk about the work; the journal's lines are instructions to you, not news for the user", repeat_after=600)
    THIRD_PERSON = Nudge(name, "third_person", "in the chat you are speaking to the user", "say you, never the user", repeat_after=600)
    DASHES = Nudge(name, "dashes", "your chat used em dashes", "write to the user as a person would: short sentences, a full stop where the dash was", repeat_after=600)
    PARAGRAPHS = Nudge(name, "paragraphs", "your last message had no blank lines between paragraphs", "a blank line between parts is what makes a message readable: one thought to a paragraph", repeat_after=600)
    REMIND = Nudge(name, "remind", "chat etiquette: a line from the journal is an instruction, not a message", "act on it or note it, never answer or mention it in the chat; what the user needs to know still goes to the chat", repeat_after=1800)
    nudges = (SHOP_TALK, THIRD_PERSON, DASHES, PARAGRAPHS, REMIND)
    REMIND_EVERY = Option("etiquette.remind_every", "Remind what a journal line is every", "Lines the journal says to the agent between reminders that a journal line is an instruction, not a message", 50, unit="lines")
    options = (REMIND_EVERY,)
