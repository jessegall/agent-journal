from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted


class MigrationConduct(Conduct):
    """The migration feature's conduct in every state: at a start, a version 3 journal waiting to be brought across is named."""

    def on_session_started_migration(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.migration.feature import MigrationFeature
        return self.unchanged(MigrationFeature.VERSION_3_NOT_BROUGHT_ACROSS.create()) if event.readings.of(MigrationFeature).version_3_waiting else self.unchanged()
