from engine.enums.key_loading import KeyLoading
from engine.viewer.window_key import WindowKey


class AgentRemovedMemoriesKey(WindowKey):
    """The removed memories of one agent, by its id, heaviest first, read when asked."""

    name = "agent-removed-memories.*"
    read = "memory page --agent {id} --removed --state removed --order weight --limit 100"
    tab = "memories"
    events = ["memory.*"]
    loading = KeyLoading.REQUESTED
