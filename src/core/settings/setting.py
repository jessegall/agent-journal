from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Setting(Model):
    """One setting: a key and its value as JSON, for one environment or, without one, for the whole project."""

    model_name = "setting"
    cli_noun = "setting"

    environment_id: int | None = None
    creator_id: int
    key: str
    value: str
