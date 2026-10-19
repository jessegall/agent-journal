import os
import socket
from dataclasses import asdict
from datetime import datetime, timezone
from urllib.error import HTTPError
from urllib.request import urlopen

from journal.config import Config
from journal.support.kept_answer import KeptAnswer
from journal.support.share_place import SharePlace
from journal.features.sharing.support.tunler import Tunler
from journal.features.sharing.support.tunler_status import TunlerStatus
from journal.features.sharing.support.tunnel_cause import TunnelCause
from journal.features.sharing.support.tunnel_service import TunnelService
from journal.support.refused import Refused
from journal.repositories.pairing_codes import PairingCodes
from journal.repositories.phones import Phones
from journal.repositories.settings import Settings
from journal.repositories.shares import Shares
from journal.supervisor_link import SupervisorLink

SERVICE = "sharing.tunnel"
DEFAULT_SERVER = "tunler.jessegall.nl"
HEALTH, MARKER = "health", "journal-share-server"
OWNED = "domain is owned by another user"
MOVED = "the journal moved the tunnel to a new address:"
LAST_LINES = 4
REACH_SECONDS = 5
ANSWER_KEPT = 20
NOT_INSTALLED = "tunler is not installed on this machine, so share links cannot reach this journal."
LOGGED_OUT = "This machine is not logged in to tunler, so share links cannot reach this journal."
OUTDATED = "This tunler is too old for the journal: it cannot tell whether its login still works. Update tunler to go on."
REJECTED = "tunler is logged in as {account}, but {host} does not accept that login. The server may be down, or the account was deleted after 30 days without use, together with its addresses. Log in again to make a new one."
HOST_MISMATCH = "This journal uses the tunler server {saved}, but tunler is logged in to {host}. Log in to {saved} again, so share links reach this journal."
ADDRESS_TAKEN = "This journal's address belongs to another tunler account. Choose a new address to reach it."
NO_SUPERVISOR = "No supervisor runs this journal, so the tunnel cannot run. Start the journal with its launcher, then try again."
OWN_ADDRESS = "{domain} is this journal's own address. Move the journal to a new address instead: the old one is released once the new one is in use."


class Tunnel:
    """The tunler process that gives the share server its web address: started under the supervisor that hosts the journal while a link is open, stopped while none is, and asked whether its address answers."""

    def __init__(self, tunler: Tunler, place: SharePlace, settings: Settings, link: SupervisorLink, shares: Shares, phones: Phones, codes: PairingCodes, config: Config) -> None:
        self.tunler, self.place, self.settings, self.link, self.shares, self.config = tunler, place, settings, link, shares, config
        self.phones, self.codes = phones, codes
        self.log = config.home / "runtime" / f"{SERVICE}.log"
        self._answer = KeptAnswer(lambda: self.reaches_address(), ANSWER_KEPT, False)

    def saved_host(self) -> str:
        from journal.features.sharing.feature import Sharing
        return str(self.settings.option(Sharing.HOST))

    def host(self) -> str:
        return self.saved_host() or self.tunler.status().host

    def address(self) -> str:
        host = self.host()
        return f"{self.place.subdomain()}.{host}" if host else ""

    def link_of(self, token: str) -> str:
        return f"https://{self.address()}/s/{token}"

    def standing(self) -> dict:
        """What the viewer shows of the tunnel: tunler's status, the server, the address and what keeps links from reaching the journal."""
        status = self.tunler.status()
        return {**asdict(status), "server": self.host() or DEFAULT_SERVER, "address": self.address(), "problems": self.problems(status)}

    def problems(self, status: TunlerStatus) -> list[str]:
        if not status.installed:
            return [NOT_INSTALLED]
        if status.outdated:
            return [OUTDATED]
        if status.rejected:
            return [REJECTED.format(account=status.account, host=status.host)]
        if not status.logged_in and not status.unreadable:
            return [LOGGED_OUT]
        if status.host and self.saved_host() and self.saved_host() != status.host:
            return [HOST_MISMATCH.format(saved=self.saved_host(), host=status.host)]
        if self.refused():
            return [ADDRESS_TAKEN]
        return []

    def settle(self) -> None:
        """Running while a link opens, a phone is paired or a code to pair one is live; stopped while none is."""
        if self.is_wanted(datetime.now(timezone.utc)):
            self.start()
        else:
            self.stop()

    def is_wanted(self, now: datetime) -> bool:
        return self.shares.open_anywhere() or bool(self.phones.live(now)) or bool(self.codes.open(now))

    def start(self) -> None:
        """Started for the share server's port and the journal's name; one running for another port or name is stopped first, and one running for these is left as it is."""
        host, command, port = self.link.hosting(), self.tunler.command(), self.place.kept().port
        if host is None or not command or not port:
            return
        subdomain = self.place.subdomain()
        kept = self.place.kept()
        inspector = kept.inspector
        if kept.tunnel != (port, subdomain) or not inspector:
            self.link.stop_service(host, SERVICE)
            inspector = self.free_port()
        self.place.keep(tunnel=(port, subdomain), inspector=inspector)
        self.link.start(host, SERVICE, [command, str(port), f"--domain={subdomain}", f"--inspect={inspector}"], self.config.root, dict(os.environ), self.log)

    def stop(self) -> None:
        host = self.link.hosting()
        if host is not None:
            self.link.stop_service(host, SERVICE)

    def restart(self) -> None:
        if self.link.hosting() is None:
            raise Refused(NO_SUPERVISOR)
        self.place.keep(tunnel=())
        self.start()

    def readdress(self) -> str:
        """A new name for the journal, the tunnel moved to it, and the old name given back to the server when the account held it."""
        host, old = self.host(), self.place.kept().subdomain
        name = self.place.new_subdomain()
        self.log.parent.mkdir(parents=True, exist_ok=True)
        with self.log.open("a") as written:
            written.write(f"{MOVED} {name}\n")
        self.place.keep(tunnel=())
        self.start()
        if old and f"{old}.{host}" in self.tunler.domains():
            self.tunler.release(old, host)
        return name

    def release(self, domain: str) -> list[str]:
        if domain == self.address():
            raise Refused(OWN_ADDRESS.format(domain=domain))
        failed = self.tunler.release(domain, self.host())
        if failed:
            raise Refused(failed)
        return self.tunler.domains()

    def answering(self) -> bool:
        """Whether the journal's address answers as its share server, asked now."""
        return self._answer.fresh()

    def answered(self) -> bool:
        """The last answer, at once: asking the tunnel's address takes a round trip, so the viewer's poll never waits on it."""
        return self._answer.now()

    def reaches_address(self) -> bool:
        address = self.address()
        if not address:
            return False
        try:
            with urlopen(f"https://{address}/{HEALTH}", timeout=REACH_SECONDS) as answer:
                return MARKER in answer.read(200).decode(errors="ignore")
        except (OSError, ValueError):
            return False

    def service(self) -> TunnelService:
        """The tunnel as the viewer lists a service: ready while its address answers, starting while it should and does not yet."""
        if self.link.hosting() is None:
            state, why = "stopped", NO_SUPERVISOR
        else:
            state, why = ("ready", "") if self.answered() else ("starting", "")
        return TunnelService(SERVICE, state, why, f"http://127.0.0.1:{self.place.kept().inspector}")

    def cause(self) -> TunnelCause:
        host, address = self.host(), self.address()
        if host and not self.reached(f"https://{host}/"):
            return TunnelCause("host", f"The tunler server {host} does not answer, so the tunnel cannot open. Check the server in Settings, or try again once it is back.")
        if self.link.hosting() is None:
            return TunnelCause("stopped", NO_SUPERVISOR)
        version = self.tunler.versions(host)
        if version.update_available:
            return TunnelCause("old", f"tunler {version.current} is older than {version.latest} on the server. Updating it may fix the connection.")
        if self.answering():
            return TunnelCause("open", f"The tunnel is open: {address} answers.")
        return TunnelCause("waiting", f"The tunnel is running, but {address} does not answer yet. The last lines it wrote:", self.last_lines())

    def last_lines(self) -> list[str]:
        """The tunnel's last lines since the journal last moved it."""
        if not self.log.is_file():
            return []
        return self.log.read_text(errors="ignore").split(MOVED)[-1].splitlines()[-LAST_LINES:]

    def refused(self) -> bool:
        return any(OWNED in line for line in self.last_lines())

    @staticmethod
    def reached(url: str) -> bool:
        """Whether anything answers at the address, even with an error."""
        try:
            with urlopen(url, timeout=REACH_SECONDS):
                return True
        except HTTPError:
            return True
        except (OSError, ValueError):
            return False

    @staticmethod
    def free_port() -> int:
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            return probe.getsockname()[1]
