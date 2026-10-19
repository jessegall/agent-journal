from typing import TypedDict


class ProfileShown(TypedDict):
    """A profile as the Profiles page shows it: its front matter, the model it runs on under Claude and under Codex, its instructions, whether the journal ships it, and where it lies."""

    name: str
    description: str
    tools: str
    kind: str
    model: str
    codex_model: str
    body: str
    shipped: bool
    path: str
