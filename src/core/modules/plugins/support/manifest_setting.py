import json
from dataclasses import dataclass

from core.base.refusal import Refusal

FLAG_VALUES = {"true": True, "on": True, "yes": True, "false": False, "off": False, "no": False}


@dataclass(frozen=True)
class ManifestSetting:
    """A setting a plugin's manifest declares: its key, title, type and default."""

    key: str
    title: str
    setting_type: str
    default: object

    def value_text(self, text: str) -> str:
        if self.setting_type == "number":
            if not text.lstrip("-").isdigit():
                raise Refusal(f"{self.key} is a number; {text} is not", "give a whole number")
            return json.dumps(int(text))
        if self.setting_type == "flag":
            if text.lower() not in FLAG_VALUES:
                raise Refusal(f"{self.key} is on or off; {text} is neither", "give on or off")
            return json.dumps(FLAG_VALUES[text.lower()])
        if self.setting_type == "list":
            return json.dumps([line.strip() for line in text.splitlines() if line.strip()])
        return json.dumps(text)
