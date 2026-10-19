from journal.http.support.route import Route

CLOSED_READS = ("/journal/secrets",)
"""What a phone may never read: a secret's fields stay on the computer. A stream is closed too: the tunnel's listener answers whole replies, so the phone asks again instead."""
WRITES = frozenset((
    "/journal/mode",
    "/journal/tasks", "/journal/tasks/{id}", "/journal/tasks/{id}/start", "/journal/tasks/{id}/finish", "/journal/tasks/{id}/reopen", "/journal/tasks/{id}/log",
    "/journal/plans/{id}/approve", "/journal/plans/{id}/start", "/journal/plans/{id}/park",
    "/journal/questions/{id}/answer",
    "/journal/messages", "/journal/messages/read", "/journal/messages/{id}/read", "/journal/messages/{id}/reply", "/journal/messages/{id}/react", "/journal/messages/{id}/press",
    "/journal/comments", "/journal/comments/{id}",
    "/journal/notices/{id}/close",
    "/journal/dumps", "/journal/dumps/{id}/choose", "/journal/dumps/{id}/decline", "/journal/dumps/{id}/direct", "/journal/dumps/{id}/answer", "/journal/dumps/{id}/dismiss",
    "/journal/agents/{id}/pause", "/journal/agents/{id}/resume",
    "/journal/shares",
    "/journal/phones/{id}/disconnect",
))
"""The acts the phone app makes: talking to the agent, answering, approving and following plans, tasks, comments and dumps, pausing the agent, sharing a row, and disconnecting itself. Settings, plugins, MCP servers, secrets, the tunnel, workflows and anything that runs a command are not among them."""


class PhoneAllowList:
    """What a paired phone may reach of the journal's API, denied unless named: every read but a secret's, and the acts its app makes, so a phone with a stolen key still cannot change how the journal runs."""

    def allows(self, route: Route) -> bool:
        if route.method == "GET":
            return route.pattern.startswith("/journal/") and not route.pattern.startswith(CLOSED_READS) and not route.pattern.endswith("/stream")
        return route.pattern in WRITES
