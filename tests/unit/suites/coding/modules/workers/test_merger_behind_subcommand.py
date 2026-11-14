from argparse import Namespace

from engine.errors.refusal import Refusal
from suites.coding.modules.workers.commands.read_behind_facts.read_behind_facts_subcommand import ReadBehindFactsSubcommand
from suites.coding.modules.workers.support.base_commit import BaseCommit
from suites.coding.modules.workers.support.behind_facts import BehindFacts


class NoWorktrees:
    def worker_worktree(self, agent_id: int) -> None:
        return None


class Numbers:
    def number(self, model: str, row_id: int) -> int:
        return 999


def test_a_worker_with_no_worktree_here_is_refused_by_its_number():
    subcommand = ReadBehindFactsSubcommand(None, NoWorktrees(), None, Numbers())
    refused = subcommand.read(Namespace(worker_id=41), None)
    assert isinstance(refused, Refusal) and refused.reason == "no worker 999 with a worktree in this environment"


def test_the_facts_print_as_plain_lines():
    facts = BehindFacts("version-5", 2, (BaseCommit("abc1234567", "Merge worker 3", tuple(["src/cart.py"])), BaseCommit("def7654321", "Fix tax", ())), ("src/cart.py", "src/shop.py"),
                        tuple(["src/cart.py"]), tuple(["src/tax.py"]), 4, True, "claude", "sonnet")
    assert facts.lines() == ["2 behind version-5", "  abc1234567 Merge worker 3: src/cart.py", "  def7654321 Fix tax: no files", "Worker files: src/cart.py, src/shop.py",
                             "Overlap: src/cart.py (4 lines changed on the base)", "Same folder, not overlap: src/tax.py", "Uncommitted work: yes", "Program: claude sonnet"]
