from features.base import Feature
from features.journal import Journal
from features.command_tags.details import CommandTagsDetails
from features.command_tags.formatters import StripTags
from features.command_tags.handlers import RunTagCommands, TeachTheTag
from features.command_tags.answering import answered
from expects import Formats


class CommandTags(Feature):
    details = CommandTagsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RunTagCommands())
        journal.events.handler(TeachTheTag())
        journal.client.formatter(StripTags(), expects=[
            Formats('[!reply:12] the answer', to='the answer'),
            Formats('plain words', to='plain words'),
        ])
        journal.agent.append_to_line("message.created", answered)
        journal.agent.append_to_line("messages.answer", answered)
