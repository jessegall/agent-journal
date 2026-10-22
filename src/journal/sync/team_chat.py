import time

from journal.engine.agent_launcher import AgentLauncher
from journal.models.environment import Environment
from journal.sync.team_account import TeamAccount
from journal.sync.team_server_link import TeamServerLink
from sync_server.lease import Lease

CHAT_LEASE = "team-chat"
TEAM_CHAT = "team"
RENEW_SECONDS = 30


class TeamChat:
    """Who runs the Team chat's agent: the one machine holding the team server's team-chat lease, which claims it, renews it while it runs the agent, and alone may start an agent in the Team chat."""

    def __init__(self, account: TeamAccount, link: TeamServerLink, launcher: AgentLauncher) -> None:
        self.account, self.link, self.launcher = account, link, launcher
        self.renewed_at = 0.0

    def claim(self, agent: str) -> Lease:
        lease = self.link.acquire_lease(CHAT_LEASE)
        self.account.write({**self.account.contents(), "holds_chat": True})
        self.renewed_at = time.monotonic()
        self.launcher.start(TEAM_CHAT, agent)
        return lease

    def holder(self) -> Lease:
        return self.link.lease_state(CHAT_LEASE)

    def renew(self) -> None:
        if self.account.is_chat_holder() and time.monotonic() - self.renewed_at >= RENEW_SECONDS:
            self.link.acquire_lease(CHAT_LEASE)
            self.renewed_at = time.monotonic()

    def start_refusal(self, environment: Environment) -> str:
        if not environment.is_team_chat or self.account.is_chat_holder():
            return ""
        return "the Team chat's agent runs on the machine that claims it: claim it first with journal team claim"

    @staticmethod
    def holder_line(lease: Lease) -> str:
        if not lease.holder:
            return "No one holds the Team chat; its messages wait until someone claims it"
        if lease.is_lapsed:
            return f"Held by {lease.holder}, offline since {time.strftime('%H:%M', time.localtime(lease.renewed_at))}; anyone may claim it"
        return f"Held by {lease.holder}"
