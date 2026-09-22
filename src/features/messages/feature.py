from features.base import Feature
from features.journal import Journal
from features.messages.details import MessagesDetails
from features.messages.formatters import CommandsAsCode
from features.messages.handlers import (CloseAnswered, CloseHandled, CloseSeenByUser, LinkToMessageInHand, NameBareNumbers, NameRunTogether,
                                        NameUnanswered, NameUnread, ResetCountsOnArrival, SaveAgentMessage)


class MessagesFeature(Feature):
    details = MessagesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SaveAgentMessage())
        journal.events.handler(ResetCountsOnArrival())
        journal.events.handler(NameUnread())
        journal.events.handler(NameUnanswered())
        journal.events.handler(CloseHandled())
        journal.events.handler(CloseSeenByUser())
        journal.events.handler(CloseAnswered())
        journal.events.handler(LinkToMessageInHand())
        journal.events.handler(NameRunTogether())
        journal.events.handler(NameBareNumbers())
        journal.client.formatter(CommandsAsCode())
