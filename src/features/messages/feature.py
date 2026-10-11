from controllers.types import Messages
from features.base import Feature
from features.journal import Journal
from features.messages.details import MessagesDetails
from features.messages.formatters import CommandsAsCode
from features.messages.closing import CloseAnswered, CloseHandled, CloseProcessed, CloseSeenByUser
from features.messages.inbox import NameUnanswered, NameUnread, ResetCountsOnArrival
from features.messages.prose import NameBareNumbers, NameRunTogether
from features.messages.answering import unanswered
from features.messages.saving import SaveAgentMessage
from features.triggers.watched import FACTS, state_facts
from resources.base import AGENT


class MessagesFeature(Feature):
    details = MessagesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SaveAgentMessage())
        journal.events.handler(ResetCountsOnArrival())
        journal.events.handler(NameUnread())
        journal.events.handler(NameUnanswered())
        journal.events.handler(CloseHandled())
        journal.events.handler(CloseSeenByUser())
        journal.events.handler(CloseProcessed())
        journal.events.handler(CloseAnswered())
        journal.events.handler(NameRunTogether())
        journal.events.handler(NameBareNumbers())
        journal.client.formatter(CommandsAsCode())
        FACTS.register(self, *state_facts("message", "unread", lambda context: context.journal.get(Messages).unread(AGENT)),
                       *state_facts("message", "unanswered", lambda context: unanswered(context.journal)))
