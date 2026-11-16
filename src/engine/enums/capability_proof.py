from enum import StrEnum


class CapabilityProof(StrEnum):
    """How a program's capability is known: written here, documented upstream, proved or refused on the
    installed release."""

    IMPLEMENTED_LOCALLY = "implemented-here"
    DOCUMENTED_UPSTREAM = "documented-upstream"
    PROVED_RUNNING = "proved-live"
    REFUSED_RUNNING = "refused-live"
