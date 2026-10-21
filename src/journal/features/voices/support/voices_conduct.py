from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.rows.setting_changed import SettingChanged

RESUME = "resume"
STARTS = ("startup", "resume")
"""The sources of a session start that are a start of the journal's: a cleared or compacted conversation goes on with the same agent."""


class VoicesConduct(Conduct):
    """The voices feature's conduct in every state: how to talk to the user at a start, the introduction when the journal started the agent, and the new voice when the user changes it."""

    def on_session_started_voices(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.voices.feature import Voices
        return self.unchanged(Voices.HOW_TO_TALK_TO_THE_USER.create(voice=event.snapshot.of(Voices).instruction))

    def on_session_started_voices_introduce(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.voices.feature import Voices
        if event.source not in STARTS:
            return self.unchanged()
        return self.unchanged().typing((Voices.SAY_YOU_ARE_BACK if event.source == RESUME else Voices.INTRODUCE_YOURSELF).create())

    def on_setting_changed_voices(self, event: SettingChanged, settings: Settings) -> Transition:
        from journal.features.voices.feature import Voices
        if event.setting not in {option.key for option in Voices.SPOKEN}:
            return self.unchanged()
        return self.unchanged(Voices.THE_VOICE_CHANGED.create(voice=event.snapshot.of(Voices).instruction))
