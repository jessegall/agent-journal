import json

from controllers.types import Features
from expects import Answered, Given, answering
from features.base import Feature
from features.journal import Journal
from features.auto_update.new_feature import new_features
from features.auto_update.routes import CHANGELOG
from features.auto_update.commands import CancelUpdate, ShowNewFeatures
from features.auto_update.details import AutoUpdateDetails
from features.auto_update.routes import get_changelog, get_new_feature, get_releases, get_upstream, post_new_feature_seen, post_update, post_update_cancel


ANNOUNCED = [one.id for one in new_features(CHANGELOG.read_text())] if CHANGELOG.is_file() else []


class AutoUpdate(Feature):
    details = AutoUpdateDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("feature", CancelUpdate(), expects=[Given((Features,)) >> Answered("the update that was counting down is cancelled")])
        journal.commands.add("feature", ShowNewFeatures(), expects=[
            Given((Features,), files=answering({".journal/seen-new-features.json": json.dumps(ANNOUNCED)})) >> Answered("no new feature waits to be seen"),
        ])
        journal.routes.add(get_changelog, get_new_feature, post_new_feature_seen, post_update, post_update_cancel, get_upstream, get_releases)
