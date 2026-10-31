from core.modules.settings.bindings.support.setting_values import SettingValues


class SampleNotesLimit:
    """A sample that reads a setting and puts a default of its own after it."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def limit(self) -> int:
        # @sin architecture_settings_SettingDefaultOfItsOwnDetector
        return self.settings.number("journal.core.sample_notes.limit", None) or 20

    def depth(self) -> int:
        return self.settings.number("journal.core.sample_notes.depth", None)
