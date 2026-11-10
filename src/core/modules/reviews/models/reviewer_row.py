from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.reviews.models.support.views import REVIEWER_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class ReviewerRow(EnvironmentScoped, ViewModel):
    """A review being done or waiting, or one step of a review being done, read from the reviewer_rows view.
    """

    cli_name = "reviewer-row"
    view = "reviewer_rows"
    key = "row_key"
    select = REVIEWER_ROWS_SELECT

    row_key: str
    environment_id: int
    review_id: int
    state: str
    subject_model: str
    subject_id: int
    row_type: str
    step_id: int
    text: str
    outcome: str
    created_at: Timestamp
