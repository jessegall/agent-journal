from collections.abc import Iterator, Sequence

from core.base.registry.agent_group_entry import AgentGroupEntry


class AgentGroupBook:
    """Finds the one group an agent of a type and profile is shown in: the group that names its profile, or else
    the group of its type that names none."""

    def __init__(self, entries: Sequence[AgentGroupEntry] = ()) -> None:
        self.entries = tuple(entries)

    def group(self, agent_type: str, profile: str) -> AgentGroupEntry | None:
        of_type = [entry for entry in self.entries if entry.agent_type == agent_type]
        named = next((entry for entry in of_type if profile in entry.profiles), None)
        return named or next((entry for entry in of_type if not entry.profiles), None)

    def members(self, key: str) -> tuple[str, ...]:
        return next((entry.profiles for entry in self.entries if entry.key == key), ())

    def problems(self, agent_types: frozenset[str]) -> Iterator[str]:
        keys = [entry.key for entry in self.entries]
        for key in sorted({key for key in keys if keys.count(key) > 1}):
            yield f"the agent group {key} is declared twice"
        for entry in self.entries:
            if entry.agent_type not in agent_types:
                yield f"the agent group {entry.key} groups {entry.agent_type}, which is no registered agent type"
        for agent_type in sorted({entry.agent_type for entry in self.entries}):
            of_type = [entry for entry in self.entries if entry.agent_type == agent_type]
            named = [profile for entry in of_type for profile in entry.profiles]
            for profile in sorted({profile for profile in named if named.count(profile) > 1}):
                yield f"the profile {profile} is in two groups of {agent_type}"
            if sum(not entry.profiles for entry in of_type) > 1:
                yield f"{agent_type} has more than one group that takes the profiles no group names"
