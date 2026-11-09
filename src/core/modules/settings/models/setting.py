import json
from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Setting(Model):
    """One setting: a key and its value as JSON, for one environment or, without one, for the whole project.
    """

    shared_rows = True

    model_name = "setting"
    cli_name = "setting"

    environment_id: int | None = None
    creator_id: int
    key: str
    value: str

    def value_text(self) -> str:
        decoded = json.loads(self.value)
        return decoded if isinstance(decoded, str) else json.dumps(decoded)
