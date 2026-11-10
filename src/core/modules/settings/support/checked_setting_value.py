from engine.errors.refusal import Refusal
from engine.registry.setting_entry import SettingEntry
from core.modules.settings.support.setting_text import SettingText


class CheckedSettingValue:
    """The one check every write of a setting passes: the text typed for it becomes a value of its type, and the
    value follows the rule its declaration carries, or the write is refused."""

    def value(self, entry: SettingEntry, text: str) -> str | int | float | bool | tuple[str, ...] | tuple[int, ...]:
        value = SettingText().value(entry, text)
        problems = entry.problems(value)
        if problems:
            raise Refusal("; ".join(problems), f"{entry.key} is unchanged; set a value that follows its rule")
        return value
