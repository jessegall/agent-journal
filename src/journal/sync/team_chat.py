import time

from journal.engine.agent_launcher import AgentLauncher
from journal.models.environment import Environment
from journal.repositories.environments import Environments
from journal.chat.cards import Cards
from journal.supervisor_link import SupervisorLink
from journal.support.actor import Actor
from journal.support.card_kind import CardKind
from journal.sync.team_account import TeamAccount
from journal.sync.team_chat_branch import TEAM_CHAT, TeamChatBranch
from journal.sync.team_server_link import TeamServerLink
from sync_server.lease import Lease

CHAT_LEASE = "team-chat"
RENEW_SECONDS = 30


class TeamChat:
    """Who runs the Team chat's agent: the one machine holding the team server's team-chat lease, which claims it, renews it while it runs the agent, and alone may start an agent in the Team chat. It lets the lease go by a release, which stops its agent here and commits and pushes the Team chat's files first, or loses it when it stops renewing it for the server's 90 seconds and another person claims it, whose claim says in the Team chat that what the last holder had not pushed stayed on their machine. A claim starts from the files of the last push."""

    def __init__(self, account: TeamAccount, link: TeamServerLink, launcher: AgentLauncher, supervisor: SupervisorLink, environments: Environments, branch: TeamChatBranch, cards: Cards) -> None:
        self.account, self.link, self.launcher, self.supervisor, self.environments = account, link, launcher, supervisor, environments
        self.branch, self.cards = branch, cards
        self.renewed_at = 0.0

    def claim(self, agent: str) -> Lease:
        former = self.holder()
        lease = self.link.acquire_lease(CHAT_LEASE)
        if former.holder and former.device_id != lease.device_id:
            self.cards.show(self.team_chat_id(), None, f"{lease.holder} claimed the Team chat while {former.holder} was offline: what {former.holder} had not pushed stayed on their machine", "warn", actor=Actor.system(), shows=CardKind.WORKTREES)
        self.branch.pull()
        self.account.write({**self.account.contents(), "holds_chat": True, "chat_device": lease.device_id})
        self.renewed_at = time.monotonic()
        self.launcher.start(TEAM_CHAT, agent)
        return lease

    def release(self) -> Lease:
        self.supervisor.stop(self.team_chat_id())
        self.branch.push_all()
        lease = self.link.release_lease(CHAT_LEASE)
        self.account.write({**self.account.contents(), "holds_chat": False})
        return lease

    def resign(self) -> None:
        self.account.write({**self.account.contents(), "holds_chat": False})
        self.supervisor.stop(self.team_chat_id())

    def team_chat_id(self) -> int:
        return self.environments.existing(TEAM_CHAT).id

    def holder(self) -> Lease:
        return self.link.lease_state(CHAT_LEASE)

    def renew(self) -> None:
        if not self.account.is_chat_holder() or time.monotonic() - self.renewed_at < RENEW_SECONDS:
            return
        lease = self.holder()
        if lease.holder and lease.device_id != self.account.contents().get("chat_device"):
            self.resign()
            return
        self.link.acquire_lease(CHAT_LEASE)
        self.renewed_at = time.monotonic()

    def start_refusal(self, environment: Environment) -> str:
        if not environment.is_team_chat or self.account.is_chat_holder():
            return ""
        return "the Team chat's agent runs on the machine that claims it: claim it first with journal team claim"

    @staticmethod
    def holder_line(lease: Lease) -> str:
        if not lease.holder:
            return "No one holds the Team chat"
        if lease.is_lapsed:
            return f"Held by {lease.holder}, offline since {time.strftime('%H:%M', time.localtime(lease.renewed_at))}; anyone may claim it"
        return f"Held by {lease.holder}"
