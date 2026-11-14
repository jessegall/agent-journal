from engine.viewer.window_key import WindowKey


class CardKey(WindowKey):
    """The card.* data of the agents.helpers window."""

    name = "card.*"
    read = "agent cards --show all --include-main --id {id}"
    events = ["agent.*", "agent_block.*", "task.*", "hook_call.*"]
    event_column = "session_agent_id"
