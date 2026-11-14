from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PrivateDataMark(EnvironmentScoped, Model):
    """A place private data was found, kept so the chat of its environment can show one card for it."""

    model_name = "private_data_mark"
    cli_name = "private-data-mark"

    environment_id: int = 0
    finding_key: str
    text: str
