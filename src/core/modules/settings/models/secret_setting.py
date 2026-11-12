from dataclasses import dataclass

from engine.model.environment_or_project import EnvironmentOrProject
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class SecretSetting(EnvironmentOrProject, Model):
    """The value of a setting declared secret, such as a token, for one environment or the whole project; the
    event log keeps its value out."""

    shared_rows = True

    model_name = "secret_setting"
    cli_name = "secret-setting"
    hidden_fields = frozenset({"value"})

    environment_id: int | None = None
    creator_id: int
    key: str
    value: str
