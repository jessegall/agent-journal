"""What record audit recognises: claims of the record that the project no longer bears out."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class EvidenceFound(Fact):
    """These many things in the record have evidence against them, each with the command that retires it."""

    count: str
    found: str


@dataclass(frozen=True, kw_only=True)
class EvidenceDue(Fact):
    """The record audit trigger says it is time to look for rows with evidence against them."""

    agent: int
