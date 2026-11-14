from dataclasses import dataclass

from engine.model.model import Model
from engine.model.environment_scoped import EnvironmentScoped


@dataclass(frozen=True, kw_only=True)
class ViewerLayout(EnvironmentScoped, Model):
    """One user's layout of one viewer page in one environment, for one suite and driver, as the layout
    tree's JSON."""

    model_name = "viewer_layout"
    cli_name = "viewer-layout"

    environment_id: int = 0
    person_id: int
    creator_id: int
    suite: str
    page: str
    driver: str = ""
    layout: str

    def has_changed_after(self, version: int | None) -> bool:
        return version is not None and self.version != version
