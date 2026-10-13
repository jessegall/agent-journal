from dataclasses import dataclass
from pathlib import Path

from resources.types import EnvironmentKind


@dataclass(frozen=True)
class AgentToStart:
    """An agent to start in an environment made for it: the environment's name, the worktree it works in, what the environment is for, who answers for it and its kind, and the words the agent starts with."""

    name: str
    worktree: str
    abstract: str
    owner: str
    prompt: str
    kind: EnvironmentKind


@dataclass(frozen=True)
class DetachedStart:
    """An agent started apart from the journal's own processes: the folder it works in, its environment, its provider, the arguments it starts with and the conversation it carries on, none when it starts afresh."""

    cwd: Path
    environment: str
    provider: str
    args: tuple[str, ...]
    conversation: str = ""
