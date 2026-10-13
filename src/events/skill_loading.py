"""What skill loading recognises: a window with no journal skill in it, skills the agent owes a load of, and a skill it loaded."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class WindowOpened(Fact):
    """A session start or a compaction opened a fresh window, in which the agent has not yet been told to load the journal skill."""

    agent: int
    uses: int
    context: float
    at: float


@dataclass(frozen=True, kw_only=True)
class WindowUpgraded(Fact):
    """A window that was opened before windows were counted is taken as already told."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class JournalSkillMissing(Fact):
    """No journal skill is loaded in the agent's window, and the trigger says it is time to say so."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class SkillsOwed(Fact):
    """These skills, each with the time from which a load counts, must be loaded before the agent's next tool call."""

    agent: int
    session: str
    skills: tuple[tuple[str, float], ...]


@dataclass(frozen=True, kw_only=True)
class SessionOwesSkills(Fact):
    """A new window owes exactly these skills, and none it owed before."""

    agent: int
    session: str
    skills: tuple[tuple[str, float], ...]


@dataclass(frozen=True, kw_only=True)
class StaleSkillsNamed(Fact):
    """Skills the agent loaded have changed on disk since, and are not held for."""

    agent: int
    skills: str


@dataclass(frozen=True, kw_only=True)
class SkillLoaded(Fact):
    """The agent loaded a skill."""

    agent: int
    skill: str
    at: float


@dataclass(frozen=True, kw_only=True)
class RefusalCounted(Fact):
    """A tool call went past the gate that holds calls until the required skills are loaded, which wanted to refuse it or not."""

    agent: int
    wanted: bool
