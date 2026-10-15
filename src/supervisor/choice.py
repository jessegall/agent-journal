from dataclasses import dataclass


@dataclass(frozen=True)
class Choice:
    """What the boot menu settled: the environment, the session to resume (empty for a new conversation), whether the hooks are set aside, and whether the agent asks before each tool."""

    environment: str
    resume: str = ""
    hooks_aside: bool = False
    skip_prompts: bool = False
