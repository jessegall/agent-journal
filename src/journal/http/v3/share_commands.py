from dataclasses import asdict

from journal.features.sharing.feature import Sharing
from journal.features.sharing.tunler import Tunler
from journal.features.sharing.tunnel import Tunnel
from journal.http.v3.action_body import ActionBody
from journal.http.v3.share_targets import ShareTargets
from journal.models.actor import Actor
from journal.refused import Refused
from journal.repositories.settings import Settings

NOT_YET = "sharing a view or a layout is not in version 4 yet: share a document, a report or a plan"


class ShareCommands:
    """What the viewer asks of sharing as a whole, each a method by the name it sends, so what it needs is kept under names of its own: the tunnel's standing, tunler's login, version and domains, the journal's address, and what a link would open."""

    def __init__(self, tunnel: Tunnel, tunler: Tunler, settings: Settings, targets: ShareTargets) -> None:
        self._tunnel, self._tunler, self._settings, self._targets = tunnel, tunler, settings, targets

    def tunnel(self, body: ActionBody, by: Actor) -> dict:
        return self._tunnel.standing()

    def check_tunnel(self, body: ActionBody, by: Actor) -> dict:
        self._tunler.forget()
        return self._tunnel.standing()

    def restart_tunnel(self, body: ActionBody, by: Actor) -> dict:
        self._tunler.forget()
        self._tunnel.restart()
        return self._tunnel.standing()

    def tunnel_cause(self, body: ActionBody, by: Actor) -> dict:
        return asdict(self._tunnel.cause())

    def login(self, body: ActionBody, by: Actor) -> dict:
        host = body.endpoint.strip() or self._tunnel.host()
        made = self._tunler.log_in(host, body.username.strip(), body.password, body.master_password)
        if made.connected:
            self._settings.set(Sharing.HOST.key, host, by)
            self._tunnel.settle()
        return {**asdict(made), **self._tunnel.standing()}

    def logout(self, body: ActionBody, by: Actor) -> dict:
        self._tunler.log_out()
        self._tunnel.stop()
        return self._tunnel.standing()

    def version(self, body: ActionBody, by: Actor) -> dict:
        return asdict(self._tunler.versions(self._tunnel.host()))

    def install_tunler(self, body: ActionBody, by: Actor) -> str:
        server = body.host.strip().removeprefix("https://").removeprefix("http://").split("/")[0]
        if not server:
            raise Refused("give the address of the tunler server to install from, such as tunler.example.com")
        installed = self._tunler.install(server)
        self._settings.set(Sharing.HOST.key, server, by)
        return installed

    def update_tunler(self, body: ActionBody, by: Actor) -> str:
        return self._tunler.update()

    def domains(self, body: ActionBody, by: Actor) -> list[str]:
        return self._tunler.domains()

    def release(self, body: ActionBody, by: Actor) -> list[str]:
        return self._tunnel.release(body.domain)

    def readdress(self, body: ActionBody, by: Actor) -> str:
        return self._tunnel.readdress()

    def answering(self, body: ActionBody, by: Actor) -> dict:
        return {"reachable": self._tunnel.answering()}

    def reachable(self, body: ActionBody, by: Actor) -> dict:
        """Whether a link's address answers: every link answers at the journal's one address, so it is the tunnel that is asked."""
        return {"reachable": self._tunnel.answering()}

    def opens(self, body: ActionBody, by: Actor) -> list[str]:
        return self._targets.opens(body.ref)

    def share_view(self, body: ActionBody, by: Actor) -> None:
        raise Refused(NOT_YET)

    def share_layout(self, body: ActionBody, by: Actor) -> None:
        raise Refused(NOT_YET)
