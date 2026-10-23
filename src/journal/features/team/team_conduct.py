from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted


class TeamConduct(Conduct):
    """The team feature's conduct in every state: at a session start, while the team is pinned to a newer journal version, the agent is told once that this journal must be upgraded and its changes wait until then."""

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        feature = team_feature()
        upgrade = event.data.part(feature).upgrade
        return self.none(feature.UPGRADE_NEEDED.create(line=upgrade)) if upgrade else self.none()


def team_feature():
    from journal.features.team.feature import TeamFeature
    return TeamFeature
