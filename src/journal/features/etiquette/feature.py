from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Etiquette(Feature):
    name = "etiquette"
    title = "Chat etiquette"

    SHOP_TALK = Nudge(name, "shop_talk", "your message talks about the journal's commands: talk about the work")
    THIRD_PERSON = Nudge(name, "third_person", "say \"you\", never \"the user\"")
    TAG_HINT = Nudge(name, "tag_hint", "the {{tag}} tag does this in one step")
    TAG_REFUSED = Nudge(name, "tag_refused", "the {{tag}} tag on {{on}} did not run")
    nudges = (SHOP_TALK, THIRD_PERSON, TAG_HINT, TAG_REFUSED)
