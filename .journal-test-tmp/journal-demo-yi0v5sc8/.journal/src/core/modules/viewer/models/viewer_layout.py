from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class ViewerLayout(Model):
    """One person's layout of one viewer page in one environment, for one suite and driver, as the layout
    tree's JSON."""

    model_name = "viewer_layout"
    cli_name = "viewer-layout"

    environment_id: int
    person_id: int
    creator_id: int
    suite: str
    page: str
    driver: str = ""
    layout: str
