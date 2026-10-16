from journal.features.etiquette.listeners.read_turn import ReadTurn
from journal.features.etiquette.listeners.remind_now_and_then import RemindNowAndThen
from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Etiquette(Feature):
    name = "etiquette"
    title = "Chat etiquette"
    help = "Shop talk and the third person in the chat are named."
    listeners = (ReadTurn, RemindNowAndThen)

    SHOP_TALK = Nudge(name, "shop_talk", "your message talks about the journal's commands", "talk about the work; the journal's lines are instructions to you, not news for the user", repeat_after=600)
    THIRD_PERSON = Nudge(name, "third_person", "in the chat you are speaking to the user", "say you, never the user", repeat_after=600)
    DASHES = Nudge(name, "dashes", "your chat ran to em dashes, the mark of agent prose", "write to the user as a person would: short sentences, a full stop where the dash was", repeat_after=600)
    PARAGRAPHS = Nudge(name, "paragraphs", "your last message ran its paragraphs together", "a blank line between parts is what makes a message readable: one thought to a paragraph", repeat_after=600)
    REMIND = Nudge(name, "remind", "chat etiquette: a line from the journal is an instruction, not a message", "act on it or note it, never answer or mention it in the chat; what the user needs to know still goes to the chat", repeat_after=1800)
    nudges = (SHOP_TALK, THIRD_PERSON, DASHES, PARAGRAPHS, REMIND)
