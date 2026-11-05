from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Environment(Model):
    """A place the work happens: a checkout folder and its branch, named uniquely."""

    model_name = "environment"
    cli_name = "environment"

    name: str
    folder: str
    branch: str = ""
    creator_id: int
