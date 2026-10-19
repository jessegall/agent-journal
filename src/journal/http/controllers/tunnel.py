from dataclasses import asdict

from journal.features.sharing.feature import Sharing
from journal.features.sharing.tunler import Tunler
from journal.features.sharing.tunnel import Tunnel
from journal.http.request import Request
from journal.http.response import Response
from journal.support.refused import Refused
from journal.repositories.settings import Settings
from journal.repositories.shares import Shares


class TunnelController:
    """The tunnel that carries links to the journal: its standing and what keeps it from answering, a restart, tunler's login, version and domains, and the journal's address."""

    def __init__(self, tunnel: Tunnel, tunler: Tunler, settings: Settings, shares: Shares) -> None:
        self.tunnel, self.tunler, self.settings, self.shares = tunnel, tunler, settings, shares

    def show(self, request: Request) -> Response:
        return Response.json(self.tunnel.standing())

    def services(self, request: Request) -> Response:
        """The tunnel while a link is open; nothing while none is, so the top bar says nothing is shared."""
        return Response.json([self.tunnel.service()] if self.shares.open_anywhere() else [])

    def check(self, request: Request) -> Response:
        self.tunler.forget()
        return Response.json(self.tunnel.standing())

    def restart(self, request: Request) -> Response:
        self.tunler.forget()
        self.tunnel.restart()
        return Response.json(self.tunnel.standing())

    def cause(self, request: Request) -> Response:
        return Response.json(asdict(self.tunnel.cause()))

    def answering(self, request: Request) -> Response:
        return Response.json({"reachable": self.tunnel.answering()})

    def login(self, request: Request) -> Response:
        body = request.body
        host = str(body.get("endpoint", "")).strip() or self.tunnel.host()
        made = self.tunler.log_in(host, str(body.get("username", "")).strip(), str(body.get("password", "")), str(body.get("master_password", "")))
        if made.connected:
            self.settings.set(Sharing.HOST.key, host, request.actor)
            self.tunnel.settle()
        return Response.json({**asdict(made), **self.tunnel.standing()})

    def logout(self, request: Request) -> Response:
        self.tunler.log_out()
        self.tunnel.stop()
        return Response.json(self.tunnel.standing())

    def version(self, request: Request) -> Response:
        return Response.json(asdict(self.tunler.versions(self.tunnel.host())))

    def install(self, request: Request) -> Response:
        server = str(request.body.get("host", "")).strip().removeprefix("https://").removeprefix("http://").split("/")[0]
        if not server:
            raise Refused("give the address of the tunler server to install from, such as tunler.example.com")
        installed = self.tunler.install(server)
        self.settings.set(Sharing.HOST.key, server, request.actor)
        return Response.json({"installed": installed})

    def update(self, request: Request) -> Response:
        return Response.json({"updated": self.tunler.update()})

    def domains(self, request: Request) -> Response:
        return Response.json(self.tunler.domains())

    def release(self, request: Request) -> Response:
        return Response.json(self.tunnel.release(str(request.body.get("domain", ""))))

    def readdress(self, request: Request) -> Response:
        return Response.json({"address": self.tunnel.readdress()})
