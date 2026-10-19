from typing import TypedDict


class ProfileShown(TypedDict):
    """A subagent profile as the Profiles page shows it: its front matter, its instructions, whether the journal ships it, and where it lies."""

    name: str
    description: str
    tools: str
    kind: str
    model: str
    body: str
    shipped: bool
    path: str
