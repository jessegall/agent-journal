from collections.abc import Mapping, Sequence


class AgentBriefPoints:
    """The points of the brief an agent works to, each with its proof, for its inspector; a suite whose agents have such briefs answers."""

    def of(self, agent_id: int) -> Sequence[Mapping[str, object]]:
        return ()
