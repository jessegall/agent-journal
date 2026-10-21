from journal.features.etiquette.support.etiquette_conduct import EtiquetteConduct
from journal.features.etiquette.support.etiquette_data_reader import EtiquetteDataReader
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.support.option import Option


class Etiquette(Feature):
    name = "etiquette"
    title = "Chat etiquette"
    help = "Shop talk and the third person in the chat are named."
    data = (EtiquetteDataReader,)
    conduct = (EtiquetteConduct,)

    SHOP_TALK_WARNING = Nudge(name, "no_shop_talk", "your message talks about the journal's commands", "talk about the work; the journal's lines are instructions to you, not news for the user", repeat_after=600)
    SECOND_PERSON = Nudge(name, "say_you_not_the_user", "in the chat you are speaking to the user", "say you, never the user", repeat_after=600)
    EM_DASH_WARNING = Nudge(name, "no_em_dashes", "your chat used em dashes", "write to the user as a person would: short sentences, a full stop where the dash was", repeat_after=600)
    PARAGRAPH_SPACING = Nudge(name, "blank_lines_between_paragraphs", "your last message had no blank lines between paragraphs", "a blank line between parts is what makes a message readable: one thought to a paragraph", repeat_after=600)
    JOURNAL_LINE_RULE = Nudge(name, "a_line_is_an_instruction", "chat etiquette: a line from the journal is an instruction, not a message", "act on it or note it, never answer or mention it in the chat; what the user needs to know still goes to the chat", repeat_after=1800)
    nudges = (SHOP_TALK_WARNING, SECOND_PERSON, EM_DASH_WARNING, PARAGRAPH_SPACING, JOURNAL_LINE_RULE)
    REMINDER_INTERVAL = Option("etiquette.remind_every", "Remind what a journal line is every", "Lines the journal says to the agent between reminders that a journal line is an instruction, not a message", 50, unit="lines")
    options = (REMINDER_INTERVAL,)
