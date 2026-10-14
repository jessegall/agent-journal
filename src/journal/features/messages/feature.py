from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Messages(Feature):
    name = "messages"
    title = "Messages"

    INBOX = Nudge(name, "inbox", "there are new messages in your inbox")
    ANSWER = Nudge(name, "answer", "answer {{messages}} before you do anything else")
    REACTION = Nudge(name, "reaction", "your message was only {{face}}, so it was not posted: react instead")
    PARAGRAPHS = Nudge(name, "paragraphs", "your last message ran its paragraphs together")
    NUMBERS = Nudge(name, "numbers", "your message names {{numbers}} without saying what they are")
    nudges = (INBOX, ANSWER, REACTION, PARAGRAPHS, NUMBERS)
