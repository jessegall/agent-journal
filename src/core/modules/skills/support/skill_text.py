from dataclasses import dataclass


@dataclass(frozen=True)
class SkillText:
    """A skill's text with its folder, description and digest, as the catalogue holds them."""

    folder: str
    description: str
    digest: str
    text: str
