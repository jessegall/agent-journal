from engine.command.dry_run import DRY_RUN, DryRunReachedEffect
from engine.errors.refusal import Refusal
from engine.tunnel.tunnel_state import TunnelState
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_login import TunlerLogin
from tunnels.tunler.support.tunler_status import TunlerStatus
from tunnels.tunler.support.tunler_version import TunlerVersion

TUNLER_HOST = "journal.tunler.example"
ACCOUNT = "ada"
CURRENT_VERSION = "v0.2.0"


class FakeTunlerClient(TunlerClient):
    """A tunler that runs nothing and reaches no network: it records what it was asked to start and stop and what
    its account was asked to do, and answers the connection a story sets."""

    def __init__(self, installed: bool = True, authenticated: bool = True, connects: bool = True, rejected: bool = False, master_needed: bool = False, login_error: str = "",
                 domains: list[str] | None = None, latest: str = CURRENT_VERSION) -> None:
        self.installed, self.authenticated, self.connects, self.rejected = installed, authenticated, connects, rejected
        self.master_needed, self.login_error = master_needed, login_error
        self.domain_names = domains or []
        self.release_error = ""
        self.current, self.latest = CURRENT_VERSION, latest
        self.subdomain: str | None = None
        self.connection = TunnelState.DISCONNECTED
        self.exit_line = ""
        self.started: list[tuple[int, str]] = []
        self.logins: list[tuple[str, str, str, str | None]] = []
        self.installed_from: list[str] = []
        self.stopped = 0
        self.logged_out = 0

    def status(self) -> TunlerStatus:
        return TunlerStatus(self.installed, self.authenticated, ACCOUNT if self.authenticated else None, TUNLER_HOST if self.installed else None, "/bin/tunler" if self.installed else None, self.rejected)

    def start(self, port: int, subdomain: str) -> None:
        self.started.append((port, subdomain))
        self.subdomain = subdomain
        self.connection = TunnelState.CONNECTED if self.connects else TunnelState.RECONNECTING

    def state(self) -> TunnelState:
        return self.connection

    def address(self) -> str | None:
        return f"https://{self.subdomain}.{TUNLER_HOST}" if self.subdomain is not None and self.connects else None

    def last_line(self) -> str:
        return self.exit_line

    def stop(self) -> None:
        self.stopped += 1
        self.connection = TunnelState.DISCONNECTED
        self.subdomain = None

    def login(self, host: str, username: str, password: str, master: str | None) -> TunlerLogin:
        self.logins.append((host, username, password, master))
        if self.login_error:
            return TunlerLogin(False, False, self.login_error)
        if self.master_needed and master is None:
            return TunlerLogin(False, True, "this account does not exist: give the master password")
        self.authenticated = True
        return TunlerLogin(True)

    def logout(self) -> None:
        if DRY_RUN.get():
            raise DryRunReachedEffect("tunler logout")  # the real client runs the tunler program, which a dry run must not
        self.logged_out += 1
        self.authenticated = False

    def domains(self) -> list[str]:
        return self.domain_names

    def release(self, domain: str) -> None:
        if self.release_error:
            raise Refusal(self.release_error)
        self.domain_names = [name for name in self.domain_names if name != domain]

    def version(self) -> TunlerVersion:
        return TunlerVersion(self.current, self.latest, self.current != self.latest)

    def update(self) -> str:
        self.current = self.latest
        return f"tunler is now {self.current}"

    def install(self, host: str) -> str:
        self.installed_from.append(host)
        self.installed = True
        return f"tunler {CURRENT_VERSION} is installed"
