from dataclasses import dataclass


@dataclass(frozen=True)
class SkillCard:
    """One of the journal's skills as the standing carries it: its name, where its file is from the project's root, the hash of its text, the words that call for it and the states that require it."""

    name: str
    path: str
    digest: str
    keywords: tuple[str, ...]
    required_in: tuple[str, ...]
