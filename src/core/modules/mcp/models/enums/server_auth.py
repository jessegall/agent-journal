from enum import StrEnum


class ServerAuth(StrEnum):
    """How an MCP server lets the agent in: with nothing, with a key the user gives, or by signing in on its
    own."""

    NONE = "none"
    KEY = "key"
    OAUTH = "oauth"
