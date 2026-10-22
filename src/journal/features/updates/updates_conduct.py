from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.feature_data import FeatureData


class UpdatesConduct(Conduct):
    """The updates feature's conduct in every state: the messages of the releases an update crossed are told to the agent once, at its next session start or tick."""

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.none(*release_lines(event.data))

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return self.none(*release_lines(event.data))


def release_lines(data: FeatureData) -> list[Nudge]:
    from journal.features.updates.feature import Updates
    return [Updates.RELEASE_MESSAGE.create(version=message.version, text=message.text) for message in data.part(Updates).messages]
