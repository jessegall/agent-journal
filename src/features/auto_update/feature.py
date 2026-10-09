from features.base import Feature
from features.journal import Journal
from features.auto_update.details import AutoUpdateDetails
from features.auto_update.routes import get_changelog, get_new_feature, get_releases, get_upstream, post_new_feature_seen, post_update, post_update_cancel


class AutoUpdate(Feature):
    details = AutoUpdateDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_changelog, get_new_feature, post_new_feature_seen, post_update, post_update_cancel, get_upstream, get_releases)
