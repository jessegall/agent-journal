from features.base import Feature
from features.journal import Journal
from features.templates.applying import ApplyTemplate, CheckTemplate
from features.templates.instructions import PrefaceShow, TellAgainOnSessionStart, TellOnStart
from features.templates.controller import Templates
from features.templates.details import TemplatesDetails

__all__ = ["Templates"]


class TemplatesFeature(Feature):
    details = TemplatesDetails

    def register(self, journal: Journal) -> None:
        journal.commands.intercept("create", CheckTemplate())
        journal.events.handler(ApplyTemplate())
        journal.commands.intercept("show", PrefaceShow())
        journal.events.handler(TellOnStart())
        journal.events.handler(TellAgainOnSessionStart())
