from collections.abc import Sequence

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.query import Query
from engine.query.kept_row_changes import KeptRowChanges
from engine.query.conditions.among import Among
from engine.query.conditions.less import Less
from engine.query.conditions.minimum import Minimum
from engine.time.timestamp import Timestamp
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.replaced_rows import replaced_rows
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class WorktreeQuery(Query[Worktree], KeptRowChanges[Worktree]):
    """Reads worktrees, with the one a worker has out and those an environment has out by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows, numbers: RowNumbers) -> None:
        self.numbers = numbers
        super().__init__(database, tables, Worktree)
        self.kept = kept

    def worker_worktree(self, agent_id: int) -> Worktree | None:
        return self.kept.read(self.table.name, self.filter(session_agent_id=agent_id).first,
                              "session_agent_id = ? AND removed_at IS NULL", [agent_id], name="workers.worker_worktree")

    def required_worker_worktree(self, agent_id: int) -> Worktree:
        worktree = self.worker_worktree(agent_id)
        if worktree is None:
            raise Refusal(f"{AgentLabel.from_row_id(agent_id, self.numbers, "worker").text} has no worktree", "journal worker-worktree list shows the worktrees")
        return worktree

    def required_newest_worktree(self, agent_id: int) -> Worktree:
        worktree = self.newest_worktree(agent_id)
        if worktree is None:
            raise Refusal(f"{AgentLabel.from_row_id(agent_id, self.numbers, "worker").text} has had no worktree", "journal worker-worktree list shows the worktrees")
        return worktree

    def is_first_worktree(self, worktree: Worktree) -> bool:
        return not self.with_removed().filter(session_agent_id=worktree.session_agent_id).matching(Less("id", worktree.id)).exists()

    def newest_worktree(self, agent_id: int) -> Worktree | None:
        return self.kept.read_newest(self.table.name, self.with_removed().filter(session_agent_id=agent_id).newest().first, "session_agent_id = ?", [agent_id], name="workers.newest_worktree")

    def worker_worktrees(self, agent_id: int) -> tuple[Worktree, ...]:
        return tuple(self.with_removed().filter(session_agent_id=agent_id).oldest().all_rows())

    def has_merge(self, agent_id: int, earliest_at: Timestamp) -> bool:
        return self.with_removed().filter(session_agent_id=agent_id).matching(Minimum("merged_at", earliest_at.text)).exists()

    def merged_among(self, agent_ids: Sequence[int]) -> tuple[Worktree, ...]:
        worktrees = self.with_removed().matching(Among("session_agent_id", agent_ids)).all_rows()
        return tuple(worktree for worktree in worktrees if worktree.merged_at is not None or worktree.merged_task_ids)

    def open_worktrees(self) -> list[Worktree]:
        return list(self.kept.scoped_read(self.table.name, lambda: tuple(self.oldest().all_rows()), "removed_at IS NULL", name="workers.open_worktrees"))

    def folder_worktrees(self, folders: Sequence[str]) -> tuple[Worktree, ...]:
        marks = ", ".join("?" for _ in folders)
        return self.kept.scoped_read(self.table.name, lambda: tuple(self.with_removed().matching(Among("folder", folders)).oldest().all_rows()),
                                     f"folder IN ({marks})", list(folders), name="workers.folder_worktrees")

    def all_worktrees(self) -> tuple[Worktree, ...]:
        return self.kept.scoped_read(self.table.name, lambda: tuple(self.with_removed().oldest().all_rows()), name="workers.all_worktrees")

    def update_kept(self, worktree: Worktree, present: tuple[Worktree, ...]) -> None:
        active = [row for row in present if row.removed_at is None]
        self.kept.update(self.table.name, lambda previous: next(iter(active), None), "session_agent_id = ? AND removed_at IS NULL",
                         [worktree.session_agent_id], name="workers.worker_worktree")

        def with_active(worktrees: tuple[Worktree, ...]) -> tuple[Worktree, ...]:
            return replaced_rows(worktrees, worktree.id, active)

        def with_present(worktrees: tuple[Worktree, ...]) -> tuple[Worktree, ...]:
            return replaced_rows(worktrees, worktree.id, present)

        self.kept.scoped_update(self.table.name, with_active, "removed_at IS NULL", name="workers.open_worktrees")
        self.kept.scoped_update(self.table.name, with_present, name="workers.all_worktrees")
