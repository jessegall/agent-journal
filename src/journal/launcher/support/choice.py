from dataclasses import dataclass


@dataclass(frozen=True)
class Choice:
    """What the boot menu settled: the environment, the session to resume (empty for a new conversation), whether the hooks that are not the journal's are set aside for the run, and whether the agent asks before each tool."""

    environment: str
    resume: str = ""
    stashed_hooks: bool = False
    prompt_flags: bool = False
