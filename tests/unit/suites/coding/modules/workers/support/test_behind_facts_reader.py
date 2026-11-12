from tests.unit.support.declared_merge_builds import declared_merge_builds
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.behind_facts_reader import BehindFactsReader
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.unit.support.plain_executor import plain_executor
from tests.unit.suites.coding.modules.workers.test_worktree_git_behind import cut_worktree, worktree_folder
from tests.unit.suites.coding.modules.workers.test_worktree_git_own_files import SampleRepository


class NoChecks:
    """Queries of a worktree no earlier look has decided about."""

    def query(self, model: type) -> "NoChecks":
        return self

    def filter(self, **values: object) -> "NoChecks":
        return self

    def oldest(self) -> "NoChecks":
        return self

    def every_row(self, reason: str) -> list[object]:
        return []


def worker() -> Agent:
    return Agent(id=7, creator_id=1, session="s-7", program="claude", role="worker", program_model="sonnet")


def facts(tmp_path, worker_files: dict[str, str], base_files: dict[str, str], uncommitted: dict[str, str] | None = None):
    repository, worktree = cut_worktree(tmp_path)
    own = SampleRepository(worktree_folder(worktree))
    for name, text in worker_files.items():
        (own.folder / name).parent.mkdir(parents=True, exist_ok=True)
        own.committed(name, text, f"Worker changes {name}")
    for name, text in base_files.items():
        (repository.folder / name).parent.mkdir(parents=True, exist_ok=True)
        repository.committed(name, text, f"Base changes {name}")
    for name, text in (uncommitted or {}).items():
        (own.folder / name).write_text(text)
    return BehindFactsReader(WorktreeGit(None, plain_executor(), declared_merge_builds()), NoChecks()).read(worktree, worker())


def test_a_file_both_changed_is_the_overlap_with_the_lines_the_base_changed_in_it(tmp_path):
    read = facts(tmp_path, {"cart.py": "TOTAL = 1\n"}, {"cart.py": "TOTAL = 2\nTAX = 3\n"})
    assert (read.behind, read.overlap, read.overlap_lines, read.program, read.model) == (1, ("cart.py",), 3, "claude", "sonnet")


def test_a_base_file_in_a_worker_folder_is_listed_apart_and_never_counted_as_overlap(tmp_path):
    read = facts(tmp_path, {"shop/cart.py": "A = 1\n"}, {"shop/tax.py": "B = 1\n", "docs/readme.md": "C\n"})
    assert (read.overlap, read.same_folder, read.overlap_lines) == ((), ("shop/tax.py",), 0)


def test_uncommitted_work_is_flagged(tmp_path):
    assert facts(tmp_path, {}, {"tax.py": "B = 1\n"}).has_uncommitted is False
    assert facts(tmp_path / "second", {}, {"tax.py": "B = 1\n"}, {"cart.py": "TOTAL = 9\n"}).has_uncommitted is True
