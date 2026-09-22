from features.base import Feature
from features.journal import Journal
from features.command_tags.details import TagsDetails
from features.command_tags.formatters import StripTags
from features.command_tags.handlers import RunTagCommands
from features.command_tags.reading import answered


class Tags(Feature):
    details = TagsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RunTagCommands())
        journal.client.formatter(StripTags())
        journal.agent.append_to_line("message.created", answered)
        journal.agent.append_to_line("messages.answer", answered)
