from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.user_paused import UserPaused


class PausingConduct(Conduct):
    """The pausing feature's conduct in every state: the user's pause of this agent pushes PausedByUser over whatever it was doing."""

    def on_user_paused_pausing(self, event: UserPaused, settings: Settings) -> Transition:
        from journal.features.pausing.states.user_pause import UserPause
        return self.push(UserPause()) if event.agent_session == event.session else self.none()
