from dataclasses import dataclass


@dataclass(frozen=True)
class HostedMode:
    """The hosted file's choices, read once at the server's start; a journal without the file is a local one."""

    public_origin: str
    agent_user: str
    proxy_user: str
    idle_minutes: int
    absolute_hours: int
    recent_login_minutes: int
    allow_app_codes: bool
