import re
import time
from dataclasses import dataclass
from pathlib import Path

from agents.seat import SubagentRow
from controllers.types import Agents
from engine.record import Record
from engine.worktree import lines, present
from features.helper_worktrees.controller import KEPT, Worktrees
from features.helpers.state import HelperAgent, HelperSnapshot, WorkState, helper_state
from providers import PROVIDERS
from resources.base import SYSTEM

PATH = re.compile(r"[\w.-]+(?:/[\w.-]+)+\.\w+|\b[\w-]+\.(?:py|js|ts|vue|md|json|toml|css|sh)\b")
FRESH = ("review", "critic", "audit", "verifier")
BUSY_STATES = (WorkState.WORKING, WorkState.NEEDS)
LISTENING = (WorkState.IDLE, WorkState.REPORTED)
HELPER_KIND = "helper"
RETIRED = "retired"
RETIRED_KEPT = 100
LANDED_WINDOW = 1000
SHOWN = 5


@dataclass(frozen=True)
class Kept:
    """A helper or subagent of the main agent that is still around to take more work."""
    kind: str
    name: str
    job: str
    files: tuple[str, ...]
    idle: bool
    message: str
    retire: str

    def overlaps(self, paths: tuple[str, ...]) -> bool:
        return any(file.endswith(path) or path.endswith(file) for file in self.files for path in paths)

    def offer(self) -> str:
        touched = f", touched {', '.join(self.files[:SHOWN])}" if self.files else ""
        return f"- {self.name} ({self.job}){touched}: {self.message}"

    def place(self) -> str:
        return f"- {self.name} ({self.job}): {self.retire}"


def named_paths(text: str) -> tuple[str, ...]:
    return tuple(dict.fromkeys(PATH.findall(text)))


def is_fresh_kind(kind: str) -> bool:
    return any(word in kind for word in FRESH)


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


def state_of(record, helper) -> WorkState:
    agent = Agents(Record(record.root, helper.environment), actor=SYSTEM).primary_to_read()
    snapshot = HelperSnapshot(agent=HelperAgent(status=agent.status, at=float(agent.at))) if agent else HelperSnapshot()
    return helper_state(helper, snapshot, time.time())


def helper_kept(record, helper) -> Kept:
    state, finish = state_of(record, helper), f"journal helper finish {helper.n}"
    message = f'journal helper say {helper.n} "<the new work>"' if state in LISTENING else finish
    return Kept(HELPER_KIND, f"helper {helper.n}, {helper.name}", helper.title, touched(record, helper), state not in BUSY_STATES, message, finish)


def retired(record) -> list[str]:
    return list(record.state("helpers").get(RETIRED, []))


def retire(record, subagent: str) -> None:
    record.state("helpers").set(RETIRED, [*retired(record), subagent][-RETIRED_KEPT:])


def subagent_rows(primary) -> list[SubagentRow]:
    return [SubagentRow.from_json(raw) for raw in primary.subagent_rows]


def subagents_kept(record, primary) -> list[Kept]:
    subagents, gone = subagent_rows(primary), set(retired(record))
    if not subagents:
        return []
    follow_up, agents = PROVIDERS[primary.provider].follow_up, Agents(record, actor=SYSTEM)
    kept = []
    for sub in (sub for sub in subagents if sub.address not in gone and not sub.is_refused()):
        own = agents.rows.by_title(sub.session) if sub.session else None
        name, _, job = sub.task.partition(":")
        kept.append(Kept(sub.kind or "subagent", name.strip(), (job or name).strip(), tuple(own.touched_files) if own else (), not sub.running,
                         follow_up.format(id=sub.address), f"journal agent retire {sub.address}"))
    return kept


def kept(record, helpers: list) -> list[Kept]:
    primary = Agents(record, actor=SYSTEM).primary_to_read()
    return [*(helper_kept(record, row) for row in helpers), *(subagents_kept(record, primary) if primary else [])]


def refusal(census: list[Kept], limit: int, kind: str, paths: tuple[str, ...]) -> str:
    idle = [k for k in census if k.idle]
    if not limit or len(census) < limit or not idle or is_fresh_kind(kind):
        return ""
    offered = sorted((k for k in idle if k.kind == kind or k.overlaps(paths)), key=lambda k: not k.overlaps(paths))
    if not offered:
        places = "\n".join(k.place() for k in idle)
        return f"""{len(census)} helpers and subagents are kept for reuse, the most this project keeps, and {len(idle)} of them wait for work. None of them is of this kind ({kind}) or touched the files this work names, so free a place before you start another:
{places}"""
    offers = "\n".join(k.offer() for k in offered)
    return f"""{len(census)} helpers and subagents are kept for reuse, the most this project keeps, and {len(idle)} of them wait for work. Send this work to one that knows it instead of starting another:
{offers}
Or free a place: journal helper finish <n> for a helper, journal agent retire <id> for a subagent."""


def knowing(census: list[Kept], paths: tuple[str, ...]) -> str:
    known = [k for k in census if k.kind == HELPER_KIND and k.idle and k.overlaps(paths)]
    if not known:
        return ""
    offers = "\n".join(k.offer() for k in known)
    return f"""
Already idle and touched the files this job names; send related work there next time:
{offers}"""
