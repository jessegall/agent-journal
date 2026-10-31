from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class SecretSetting(Model):
    """The value of a setting declared secret, such as a token, for one environment or the whole project; the event
    log keeps its value out."""

    model_name = "secret_setting"
    cli_name = "secret-setting"
    hidden_fields = frozenset({"value"})

    environment_id: int | None = None
    creator_id: int
    key: str
    value: str
