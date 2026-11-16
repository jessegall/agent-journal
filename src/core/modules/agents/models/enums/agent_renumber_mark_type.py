from enum import StrEnum


class AgentRenumberMarkType(StrEnum):
    """The chat mark that tells the person what the renumber of agents changed."""

    RENUMBER = "agents.renumber"
