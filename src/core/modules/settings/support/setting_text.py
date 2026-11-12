import json

from engine.errors.refusal import Refusal
from engine.registry.setting_entry import SettingEntry
from engine.enums.setting_type import SettingType
from engine.types.type_guards import is_text_list

JSON_LIST_START = "["
FLAG_TEXTS = {"on": True, "true": True, "yes": True, "off": False, "false": False, "no": False}


class SettingText:
    """Turns the text a user types after journal setting set into a value of the setting's type, or refuses
    it. A list is items split on commas, or a JSON list when an item itself holds a comma."""

    def value(self, entry: SettingEntry, text: str) -> str | int | float | bool | tuple[str, ...] | tuple[int, ...]:
        match SettingType(entry.type):
            case SettingType.NUMBER:
                return self.number(entry, text)
            case SettingType.FLAG:
                if text.lower() not in FLAG_TEXTS:
                    raise self.refusal(entry, text)
                return FLAG_TEXTS[text.lower()]
            case SettingType.LIST:
                return self.listed(entry, text)
            case SettingType.NUMBER_LIST:
                return tuple(int(self.number(entry, item.strip())) for item in text.split(",") if item.strip())
            case SettingType.CHOICE:
                if text not in entry.choices:
                    raise Refusal(f"{entry.key} is one of {', '.join(entry.choices)}, not '{text}'")
                return text
            case SettingType.TEXT | SettingType.ANY:
                return text

    def listed(self, entry: SettingEntry, text: str) -> tuple[str, ...]:
        if not text.startswith(JSON_LIST_START):
            return tuple(item.strip() for item in text.split(",") if item.strip())
        try:
            items: object = json.loads(text)
        except ValueError:
            raise self.refusal(entry, text) from None
        if not is_text_list(items):
            raise self.refusal(entry, text)
        return tuple(items)

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
