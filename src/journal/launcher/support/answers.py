from dataclasses import dataclass


LEGACY_KEYS = {"skip_prompts": "prompt_flags", "hooks_aside": "stashed_hooks"}


@dataclass(frozen=True)
class Answers:
    """The menu's answers that carry over to the next launch: whether the agent asks before each tool, and whether other hooks are set aside."""

    prompt_flags: bool = False
    stashed_hooks: bool = False

    @classmethod
    def parsed(cls, data: dict) -> "Answers":
        return cls(**{LEGACY_KEYS.get(key, key): value for key, value in data.items()})
