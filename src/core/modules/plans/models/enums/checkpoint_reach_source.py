from enum import StrEnum


class CheckpointReachSource(StrEnum):
    """Where the work of a reached checkpoint stood when its run started: merged into the branch, still in testing
    before the window was done, or on the commit of the agent that holds the whole window in its own checkout."""

    MERGED = "merged"
    EARLY = "early"
    AGENT_COMMIT = "agent_commit"

    def opens_phases(self) -> bool:
        return self is CheckpointReachSource.MERGED
