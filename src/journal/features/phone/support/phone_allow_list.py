from journal.http.support.route import Route

TABLES = ("tasks", "plans", "docs", "reports", "facts", "rules", "reminders", "environments", "questions", "sequences", "templates", "workers", "messages", "notices", "dumps", "agents", "shares", "checks", "triggers")
"""The rows a phone lists and opens: what the viewer's own pages show, without secrets or plugins."""
READS = frozenset((
    *(f"/journal/{table}" for table in TABLES), *(f"/journal/{table}/{{id}}" for table in TABLES),
    "/journal/viewer", "/journal/manifest", "/journal/identity", "/journal/health", "/journal/journals", "/journal/summary", "/journal/bar",
    "/journal/settings", "/journal/mode", "/journal/migration", "/journal/entries", "/journal/outputs/{id}", "/journal/voices", "/journal/search",
    "/journal/project-files", "/journal/project-files/find", "/journal/project-files/file", "/journal/project-files/diff",
    "/journal/attachments", "/journal/{table}/{id}/files/{name}", "/journal/comments", "/journal/reactions", "/journal/nudges", "/journal/docs/search", "/journal/docs/{id}/export", "/journal/reports/{id}/export",
    "/journal/tasks/{id}/logs", "/journal/plans/{id}/tasks", "/journal/plans/{id}/timeline", "/journal/workers/{id}/transcript",
    "/journal/agents/live", "/journal/agents/controls/{provider}", "/journal/agents/{id}/edits", "/journal/agents/{id}/edits/file", "/journal/agents/{id}/terminal", "/journal/agents/{id}/transcript",
    "/journal/agents/{id}/subagents/{session}/transcript", "/journal/skills", "/journal/skills/{name}", "/journal/shares/opens",
))
"""The reads the phone's pages make, each by name: no secret, and no read that starts a program, such as the MCP check, nor the pages that set how the journal runs: workflows, plugins, the tunnel and profiles. A stream is not among them: the tunnel's listener answers whole replies, so the phone asks again instead."""
WRITES = frozenset((
    "/journal/mode",
    "/journal/tasks", "/journal/tasks/{id}", "/journal/tasks/{id}/start", "/journal/tasks/{id}/finish", "/journal/tasks/{id}/reopen", "/journal/tasks/{id}/log",
    "/journal/plans/{id}/approve", "/journal/plans/{id}/start", "/journal/plans/{id}/park",
    "/journal/questions/{id}/answer",
    "/journal/messages", "/journal/messages/read", "/journal/messages/{id}/read", "/journal/messages/{id}/reply", "/journal/messages/{id}/react", "/journal/messages/{id}/press", "/journal/messages/{id}/undock",
    "/journal/comments", "/journal/comments/{id}",
    "/journal/notices/{id}/close",
    "/journal/dumps", "/journal/dumps/{id}/choose", "/journal/dumps/{id}/decline", "/journal/dumps/{id}/direct", "/journal/dumps/{id}/answer", "/journal/dumps/{id}/dismiss",
    "/journal/agents/{id}/pause", "/journal/agents/{id}/resume",
    "/journal/shares", "/journal/shares/{id}/approve", "/journal/shares/{id}/stop",
    "/journal/phones/{id}/disconnect",
))
"""The acts the phone app makes: talking to the agent, answering, approving and following plans, tasks, comments and dumps, pausing the agent, sharing a row, and disconnecting itself. Settings, plugins, MCP servers, secrets, the tunnel, workflows and anything that runs a command are not among them."""


class PhoneAllowList:
    """What a paired phone may reach of the journal's API, denied unless named: the reads its pages make and the acts its app makes, so a phone with a stolen key still cannot read a secret, start a program or change how the journal runs."""

    def allows(self, route: Route) -> bool:
        return route.pattern in (READS if route.method == "GET" else WRITES)
