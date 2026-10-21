from dataclasses import dataclass


@dataclass(frozen=True)
class Answers:
    """The menu's answers that carry over to the next launch: whether the agent asks before each tool, and whether other hooks are set aside."""

    skip_prompts: bool = False
    hooks_aside: bool = False

    @classmethod
    def parsed(cls, data: dict) -> "Answers":
        return cls(**data)
