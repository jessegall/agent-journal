from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.sequences.models.support.views import SEQUENCE_RUN_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class SequenceRunRow(EnvironmentScoped, ViewModel):
    """A sequence run still going, with its sequence's title and steps, read from the sequence_run_rows view.
    """

    cli_name = "sequence-run"
    view = "sequence_run_rows"
    key = "id"
    select = SEQUENCE_RUN_ROWS_SELECT

    id: int
    environment_id: int
    session_agent_id: int
    sequence_id: int
    title: str
    steps: str
    step_number: int
    step_started: bool
    created_at: Timestamp
