from core.base.refusal import Refusal
from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_type import SettingType

FLAG_WORDS = {"on": True, "true": True, "yes": True, "off": False, "false": False, "no": False}


class SettingText:
    """Turns the text a person types after journal setting set into a value of the setting's type, or refuses it."""

    def value(self, entry: SettingEntry, text: str) -> str | int | float | bool | tuple[str, ...]:
        match SettingType(entry.type):
            case SettingType.NUMBER:
                return self.number(entry, text)
            case SettingType.FLAG:
                if text.lower() not in FLAG_WORDS:
                    raise self.refusal(entry, text)
                return FLAG_WORDS[text.lower()]
            case SettingType.LIST:
                return tuple(item.strip() for item in text.split(",") if item.strip())
            case SettingType.CHOICE:
                if text not in entry.choices:
                    raise Refusal(f"{entry.key} is one of {', '.join(entry.choices)}, not '{text}'")
                return text
            case SettingType.TEXT:
                return text

    def number(self, entry: SettingEntry, text: str) -> int | float:
        try:
            return int(text)
        except ValueError:
            try:
                return float(text)
            except ValueError:
                raise self.refusal(entry, text) from None

    @staticmethod
    def refusal(entry: SettingEntry, text: str) -> Refusal:
        return Refusal(f"{entry.key} is a {entry.type}, not '{text}'")
