import hashlib
import ssl
from argparse import Namespace

from journal.console.command import Command
from journal.features.team.support.team_join import TeamJoin
from journal.support.caller import Caller
from journal.support.rejection import Rejection
from journal.sync.sync_status import SyncStatus
from journal.sync.team_account import TeamAccount
from journal.sync.team_requests import TeamRequests
from journal.sync.team_server_link import TeamServerLink
from sync_server.login_request import LoginRequest
from journal.sync.team_chat import TeamChat

PASSWORD_PROMPT = "run journal team {verb} yourself in a terminal: it asks your password without showing it, and an agent cannot type it"


class TeamCommand(Command):
    """This journal's team: joining its server, logging in again, inviting a person, how the sync stands, and the team's devices."""

    noun = "team"

    def __init__(self, account: TeamAccount, link: TeamServerLink, joining: TeamJoin, sync_status: SyncStatus, team_chat: TeamChat) -> None:
        self.account, self.link, self.joining, self.sync_status, self.team_chat = account, link, joining, sync_status, team_chat

    def arguments(self, verbs) -> None:
        join = self.verb(verbs, "join", "join a team's server with the line its setup or an invitation printed: a team with no journal yet takes this one whole, else this machine downloads the team's")
        join.add_argument("address")
        join.add_argument("--code", required=True)
        join.add_argument("--fingerprint", default="", help="the certificate authority a server on a bare address serves, from the join line")
        join.add_argument("--name", default="", help="your name, for a new account; git's user.name when left out")
        join.add_argument("--password", default="", help="filled in by the journal command's own prompt; never type it on a command line")
        login = self.verb(verbs, "login", "log this machine in again, as after its device was revoked")
        login.add_argument("--email", required=True)
        login.add_argument("--password", default="", help="filled in by the journal command's own prompt; never type it on a command line")
        self.verb(verbs, "invite", "an invitation code for a person's email, and the line they join with; admins only").add_argument("email")
        self.verb(verbs, "status", "the team's address, this person and device, and how the sync stands")
        self.verb(verbs, "devices", "every device of the team; admins only")
        self.verb(verbs, "revoke", "revoke a device, so it reaches the team no more; admins only").add_argument("device", type=int)
        claim = self.verb(verbs, "claim", "hold the Team chat, so this machine runs its agent; one machine holds it at a time")
        claim.add_argument("--agent", default="claude", help="the agent program to run it with")
        self.verb(verbs, "release", "let the Team chat go, so another person may claim it; its agent on this machine stops")
        self.verb(verbs, "chat", "who holds the Team chat, and whether they are online")

    def join(self, args: Namespace, caller: Caller) -> int:
        if not args.password:
            raise Rejection(PASSWORD_PROMPT.format(verb="join"))
        print(TeamRequests.reached(lambda: self.joining.join(args.address.rstrip("/"), args.code, args.password, args.fingerprint, args.name)))
        return 0

    def login(self, args: Namespace, caller: Caller) -> int:
        if not args.password:
            raise Rejection(PASSWORD_PROMPT.format(verb="login"))
        self.joined()
        answer = TeamRequests.reached(lambda: self.link.login(self.account.address(), LoginRequest(args.email, args.password, self.account.device_name())))
        self.account.write({**self.account.contents(), "token": answer.token, "device": answer.device_id, "account_id": answer.account_id})
        print(f"logged in again as {answer.name}, device {answer.device_id}")
        return 0

    def invite(self, args: Namespace, caller: Caller) -> int:
        self.joined()
        answer = TeamRequests.reached(lambda: self.link.invite(args.email))
        fingerprint = self.fingerprint()
        print(f"{answer.email} joins with this line until {answer.expires_at:.0f}:\n\n    journal team join {self.account.address()} --code {answer.code}{f' --fingerprint {fingerprint}' if fingerprint else ''}")
        return 0

    def status(self, args: Namespace, caller: Caller) -> int:
        self.joined()
        print(f"team: {self.account.address()}\nperson: user {self.account.user_number()}\ndevice: {self.account.device()}\nsync: {self.sync_status.line()}")
        return 0

    def devices(self, args: Namespace, caller: Caller) -> int:
        self.joined()
        for device in TeamRequests.reached(self.link.devices).devices:
            print(f"{device.id:<5} {device.name:<30} user {device.account_id}{'  revoked' if device.is_revoked() else ''}")
        return 0

    def revoke(self, args: Namespace, caller: Caller) -> int:
        self.joined()
        device = TeamRequests.reached(lambda: self.link.revoke(args.device))
        print(f"device {device.id}, {device.name}, is revoked")
        return 0

    def claim(self, args: Namespace, caller: Caller) -> int:
        self.joined()
        lease = TeamRequests.reached(lambda: self.team_chat.claim(args.agent))
        print(f"you hold the Team chat now, as {lease.holder}; its agent starts on this machine in the team environment's worktree")
        return 0

    def release(self, args: Namespace, caller: Caller) -> int:
        self.joined()
        TeamRequests.reached(self.team_chat.release)
        print("you no longer hold the Team chat; its agent on this machine is stopped, and anyone may claim it")
        return 0

    def chat(self, args: Namespace, caller: Caller) -> int:
        self.joined()
        print(TeamChat.holder_line(TeamRequests.reached(self.team_chat.holder)))
        return 0

    def joined(self) -> None:
        if not self.account.is_joined():
            raise Rejection("this journal has joined no team: journal team join <address> --code <code> joins one")

    def fingerprint(self) -> str:
        root = self.account.root_path()
        return hashlib.sha256(ssl.PEM_cert_to_DER_cert(root.read_text())).hexdigest() if root.is_file() else ""
