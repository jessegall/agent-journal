from features.base import Feature
from features.journal import Journal
from features.auto_update.details import AutoUpdateDetails
from features.auto_update.routes import get_changelog, get_releases, get_upstream, post_update


class AutoUpdate(Feature):
    details = AutoUpdateDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_changelog, post_update, get_upstream, get_releases)
