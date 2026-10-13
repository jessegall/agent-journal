"""The agents kept for reuse: who is still around to take more work, what the project allows of them, and what is said when a new one is asked for while others wait."""

import re
from dataclasses import dataclass

from declaring.settings import Settings
from resources.types import SubagentRow

PATH = re.compile(r"[\w.-]+(?:/[\w.-]+)+\.\w+|\b[\w-]+\.(?:py|js|ts|vue|md|json|toml|css|sh)\b")
FRESH = ("review", "critic", "audit", "verifier")
HELPER_KIND = "helper"
RETIRED = "retired"
RETIRED_KEPT = 100
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


def retired(record) -> list[str]:
    return list(record.state("helpers").get(RETIRED, []))


def retire(record, subagent: str) -> None:
    record.state("helpers").set(RETIRED, [*retired(record), subagent][-RETIRED_KEPT:])


def subagent_rows(primary) -> list:
    return [SubagentRow.from_json(raw) for raw in primary.subagent_rows]




def refusal(census: list[Kept], limits: Settings, kind: str, paths: tuple[str, ...]) -> str:
    """Why a new agent of this kind starts later: the project allows only so many agents working at once, and only so many of one kind kept for reuse; an idle agent of another kind never has to go."""
    if is_fresh_kind(kind):
        return ""
    per_type, at_once = int(limits.kept), int(limits.working)
    busy = [k for k in census if not k.idle]
    if at_once and len(busy) >= at_once:
        working = "\n".join(f"- {k.name} ({k.job})" for k in busy)
        return f"""{len(busy)} agents work at once, the most this project allows. Wait for one to report, or stop one, before you start another:
{working}"""
    same = [k for k in census if k.kind == kind]
    idle = [k for k in same if k.idle]
    if not per_type or len(same) < per_type or not idle:
        return ""
    offered = sorted(idle, key=lambda k: not k.overlaps(paths))
    offers = "\n".join(k.offer() for k in offered)
    return f"""{len(same)} agents of this kind ({kind}) are kept for reuse, the most this project keeps of one kind, and {len(idle)} of them wait for work. Send this work to one that knows it instead of starting another:
{offers}
Or free a place: journal helper retire <n> --why "<reason>" for a helper, journal agent retire <id> for a subagent."""


def knowing(census: list[Kept], paths: tuple[str, ...]) -> str:
    known = [k for k in census if k.kind == HELPER_KIND and k.idle and k.overlaps(paths)]
    if not known:
        return ""
    offers = "\n".join(k.offer() for k in known)
    return f"""
Already idle and touched the files this job names; send related work there next time:
{offers}"""
