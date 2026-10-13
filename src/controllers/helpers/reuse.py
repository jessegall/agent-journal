import re
import time
from dataclasses import dataclass
from pathlib import Path

from controllers.agents import Agents
from engine.record import Record
from engine.worktree import lines, present
from controllers.helper_worktrees import KEPT, Worktrees
from controllers.helpers.state import HelperAgent, HelperSnapshot, WorkState, helper_state
from serving import SERVED, Processes, Providers
from resources.base import SYSTEM
from resources.reuse import FRESH, HELPER_KIND, PATH, RETIRED, RETIRED_KEPT, SHOWN, Kept, is_fresh_kind, knowing, named_paths, refusal, retire, retired, subagent_rows  # noqa: F401

BUSY_STATES = (WorkState.WORKING, WorkState.NEEDS)
LISTENING = (WorkState.IDLE, WorkState.REPORTED)
LANDED_WINDOW = 1000


@dataclass(frozen=True)
class Branch:
    """A helper's work in the project: the commit its worktree was cut from and the ref holding what it did, both empty when it has no worktree or the work is gone."""

    project: Path = Path()
    base: str = ""
    ref: str = ""

    def exists(self) -> bool:
        return bool(self.base and self.ref)


def branch_of(record, helper) -> Branch:
    if not helper.worktree:
        return Branch()
    cut, project = Worktrees(record, actor=SYSTEM).load(int(helper.worktree)), record.root.resolve().parent
    ref = next((ref for ref in (f"refs/heads/{cut.branch}", f"{KEPT}/{cut.title}") if present(project, ref)), "")
    return Branch(project, cut.base, ref)


def touched(record, helper) -> tuple[str, ...]:
    branch = branch_of(record, helper)
    return tuple(lines(branch.project, "diff", "--name-only", f"{branch.base}...{branch.ref}")) if branch.exists() else ()


TEST_FILE = re.compile(r"(^|/)(tests?/|browser/[^/]*\.mjs$|test\.py$|test_[^/]*\.py$|[^/]*_test\.py$|[^/]*\.test\.(js|mjs|ts)$)")


def written_tests(record, helper) -> tuple[str, ...]:
    """The test files a helper added or changed, which it did not run and the agent that dispatched it does."""
    return tuple(path for path in touched(record, helper) if TEST_FILE.search(path))


def unlanded(record, helper) -> tuple[str, ...]:
    """What a helper committed that the project's branch lacks, by message, so a commit taken over by cherry-pick counts as landed."""
    branch = branch_of(record, helper)
    if not branch.exists():
        return ()
    landed = set(lines(branch.project, "log", "--format=%s", "-n", str(LANDED_WINDOW), "HEAD"))
    return tuple(subject for subject in reversed(lines(branch.project, "log", "--format=%s", f"{branch.base}..{branch.ref}")) if subject not in landed)


def agent_runs(record, helper) -> bool:
    """The one answer to whether a helper's agent runs, which saying, stopping, finishing, the notices and the limit on kept helpers all go by."""
    return bool(SERVED.given(Processes).running_in(record, helper.environment))


def state_of(record, helper) -> WorkState:
    agent = Agents(Record(record.root, helper.environment), actor=SYSTEM).primary_to_read()
    snapshot = HelperSnapshot(agent=HelperAgent(status=agent.status, at=float(agent.at))) if agent and agent_runs(record, helper) else HelperSnapshot()
    return helper_state(helper, snapshot, time.time())


def helper_kept(record, helper) -> Kept:
    state, finish = state_of(record, helper), f'journal helper retire {helper.n} --why "<why it cannot be reused>"'
    message = f'journal helper say {helper.n} "<the new work>"' if state in LISTENING else finish
    return Kept(HELPER_KIND, f"helper {helper.n}, {helper.name}", helper.title, touched(record, helper), state not in BUSY_STATES, message, finish)


def subagents_kept(record, primary) -> list[Kept]:
    subagents, gone = subagent_rows(primary), set(retired(record))
    if not subagents:
        return []
    follow_up, agents = SERVED.given(Providers).of(primary.provider).follow_up, Agents(record, actor=SYSTEM)
    kept = []
    for sub in (sub for sub in subagents if sub.address not in gone and not sub.is_refused()):
        own = agents.rows.by_title(sub.session) if sub.session else None
        name, _, job = sub.task.partition(":")
        kept.append(Kept(sub.kind or "subagent", name.strip(), (job or name).strip(), tuple(own.touched_files) if own else (), not sub.running,
                         follow_up.format(id=sub.address), f"journal agent retire {sub.address}"))
    return kept


def kept(record, helpers: list) -> list[Kept]:
    primary = Agents(record, actor=SYSTEM).primary_to_read()
    return [*(helper_kept(record, row) for row in helpers if agent_runs(record, row)), *(subagents_kept(record, primary) if primary else [])]
