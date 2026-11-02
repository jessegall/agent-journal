from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import UNANNOUNCED_PERCENT, Watch


class BackgroundRunWatchListener(SaveListener):
    """A run moved to the background is watched by the agent that started it, so it hears how the run goes."""

    name = "processes.background-run-watch"
    event = "process.*"

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if isinstance(process, Process) and change.move is not None and change.move.name == "background":
            self.repository.save(Watch(agent_id=process.agent_id, process_id=process.id, creator_id=process.agent_id, given_percent=UNANNOUNCED_PERCENT), change.context)
