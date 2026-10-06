from features.base import Feature
from features.journal import Journal
from features.command_tags.details import CommandTagsDetails
from features.command_tags.formatters import StripTags
from features.command_tags.handlers import RunTagCommands, TeachTheTag
from features.command_tags.answering import answered


class CommandTags(Feature):
    details = CommandTagsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RunTagCommands())
        journal.events.handler(TeachTheTag())
        journal.client.formatter(StripTags())
        journal.agent.append_to_line("message.created", answered)
        journal.agent.append_to_line("messages.answer", answered)
