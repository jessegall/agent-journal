from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Template(Model):
    """Saved instructions and a starting outline for new items, written once and used many times. Project-wide."""

    title: str = ""
    applies_to: tuple[str, ...] = ()
    """The kinds of row it is for, such as plan or doc; empty means any."""
    purpose: str = ""
    """What it is used for, such as critique: the viewer offers critique templates on a plan."""
    brief: str = ""
    """The instructions read before working on anything made from it."""
    parts: tuple[str, ...] = ()
    """The outline a new item starts with, each part as title: body."""
