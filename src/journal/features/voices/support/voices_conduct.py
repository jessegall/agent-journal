from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.rows.setting_changed import SettingChanged

RESUME = "resume"
STARTS = ("startup", "resume")


class VoicesConduct(Conduct):
    """The voices feature's conduct in every state: how to talk to the user at a start, the introduction when the journal started the agent, and the new voice when the user changes it."""

    def on_session_started_voices(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.voices.feature import Voices
        return self.none(Voices.VOICE_INSTRUCTION.create(voice=event.data.part(Voices).instruction))

    def on_session_started_voices_introduce(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.voices.feature import Voices
        if event.source not in STARTS:
            return self.none()
        return self.none().typing((Voices.RETURN_GREETING if event.source == RESUME else Voices.INTRODUCE_YOURSELF).create())

    def on_setting_changed_voices(self, event: SettingChanged, settings: Settings) -> Transition:
        from journal.features.voices.feature import Voices
        if event.setting not in {option.key for option in Voices.VOICE_OPTIONS}:
            return self.none()
        return self.none(Voices.VOICE_CHANGE.create(voice=event.data.part(Voices).instruction))
