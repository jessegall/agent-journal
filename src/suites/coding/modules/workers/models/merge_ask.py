from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.lifecycles.merge_ask_lifecycle import MergeAskLifecycle


@dataclass(frozen=True, kw_only=True)
class MergeAsk(EnvironmentScoped, Model):
    """A worker's ask for the merge of its committed work, whole or up to one commit, with its note."""

    model_name = "worker_merge_ask"
    cli_name = "merge-ask"
    lifecycle = MergeAskLifecycle

    environment_id: int = 0
    creator_id: int
    worktree_id: int
    commit_id: str
    task_ids: str
    unit_name: str
    note: str
    is_whole: bool
    state: MergeAskState = MergeAskState.WAITING

    def tasks(self) -> tuple[int, ...]:
        return tuple(int(task_id) for task_id in self.task_ids.split(",") if task_id)
