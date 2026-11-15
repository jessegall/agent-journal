from enum import StrEnum


class CapabilityProof(StrEnum):
    """How a program's capability is known: written here, documented upstream, proved or refused on the installed release."""

    IMPLEMENTED_HERE = "implemented-here"
    DOCUMENTED_UPSTREAM = "documented-upstream"
    PROVED_LIVE = "proved-live"
    REFUSED_LIVE = "refused-live"
