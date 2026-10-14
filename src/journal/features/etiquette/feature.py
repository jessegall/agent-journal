from journal.features.etiquette.listeners.read_turn import ReadTurn
from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Etiquette(Feature):
    name = "etiquette"
    title = "Chat etiquette"
    help = "Shop talk and the third person in the chat are named."
    listeners = (ReadTurn,)

    SHOP_TALK = Nudge(name, "shop_talk", "your message talks about the journal's commands", "talk about the work; the journal's lines are instructions to you, not news for the user", repeat_after=600)
    THIRD_PERSON = Nudge(name, "third_person", "say you, never the user", "you are speaking to them", repeat_after=600)
    nudges = (SHOP_TALK, THIRD_PERSON)
