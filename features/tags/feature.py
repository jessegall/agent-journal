from features.base import Feature
from features.journal import Journal
from features.tags.details import TagsDetails
from features.tags.formatters import StripTags
from features.tags.handlers import CopyToChat, RemindToTag, RunTagCommands
from features.tags.interceptors import NotifyTagNotUsed
from features.tags.reading import SHOWN, names, places, verbosity


class Tags(Feature):
    details = TagsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RemindToTag())
        journal.events.handler(RunTagCommands())
        journal.events.handler(CopyToChat())
        journal.client.formatter(StripTags())
        journal.agent.interceptor(NotifyTagNotUsed())

    def settings_view(self, record) -> dict:
        settings = record.setting(self.name, {})
        return {"names": names(settings), "places": places(settings), "verbosity": verbosity(settings), "levels": list(SHOWN)}
