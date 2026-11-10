from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.view_model import ViewModel
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.support.views import PROCESS_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class ProcessRow(EnvironmentScoped, ViewModel):
    """A process as the commands and output windows draw it, read from the process_rows view without its
    folder, shell and process number."""

    cli_name = "process"
    view = "process_rows"
    key = "id"
    select = PROCESS_ROWS_SELECT

    id: int
    environment_id: int
    session_agent_id: int
    line: str
    state: ProcessState
