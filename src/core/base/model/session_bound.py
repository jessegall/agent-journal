class SessionBound:
    """A model whose new row belongs to the session that makes it, unless it names another."""

    session_agent_id: int | None
