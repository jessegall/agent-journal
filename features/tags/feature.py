from features.base import Feature
from features.journal import Journal
from features.tags.details import TagsDetails
from features.tags.formatters import StripTags
from features.tags.handlers import CopyToChat, RunTagCommands
from features.tags.interceptors import NotifyTagNotUsed
from features.tags.reading import runs


class Tags(Feature):
    details = TagsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RunTagCommands())
        journal.events.handler(CopyToChat())
        journal.client.formatter(StripTags())
        journal.agent.interceptor(NotifyTagNotUsed())

    def settings_view(self, record) -> dict:
        settings = record.setting(self.name, {})
        return {"runs": runs(settings)}
