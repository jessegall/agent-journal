import json
from dataclasses import dataclass

from core.base.refusal import Refusal

FLAG_VALUES = {"true": True, "on": True, "yes": True, "false": False, "off": False, "no": False}


@dataclass(frozen=True)
class ManifestSetting:
    """A setting a plugin's settings file declares: its key, title, value type, default and, for a choice,
    its choices."""

    key: str
    title: str
    value_type: str
    default: object
    choices: tuple[str, ...]

    def value_text(self, text: str) -> str:
        if self.value_type == "number":
            if not text.lstrip("-").isdigit():
                raise Refusal(f"{self.key} is a number; {text} is not", "give a whole number")
            return json.dumps(int(text))
        if self.value_type == "flag":
            if text.lower() not in FLAG_VALUES:
                raise Refusal(f"{self.key} is on or off; {text} is neither", "give on or off")
            return json.dumps(FLAG_VALUES[text.lower()])
        if self.value_type == "list":
            return json.dumps([line.strip() for line in text.splitlines() if line.strip()])
        if self.value_type == "choice" and text not in self.choices:
            raise Refusal(f"{self.key} is one of {', '.join(self.choices)}; {text} is not", "give one of them")
        if self.value_type == "secret":
            raise Refusal(f"{self.key} is a secret, which no command sets", "fill it as a secret of the journal")
        return json.dumps(text)
