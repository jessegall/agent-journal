from dataclasses import asdict
from datetime import datetime, timezone

from journal.features.sharing.feature import Sharing
from journal.features.sharing.support.tunler import Tunler
from journal.features.sharing.support.tunnel import Tunnel
from journal.http.support.request import Request
from journal.support.response import Response
from journal.support.rejection import Rejection
from journal.repositories.setting_rows import SettingRows


class TunnelController:
    """The tunnel that carries links to the journal: its status and what keeps it from answering, a restart, tunler's login, version and domains, and the journal's address."""

    def __init__(self, tunnel: Tunnel, tunler: Tunler, settings: SettingRows) -> None:
        self.tunnel, self.tunler, self.settings = tunnel, tunler, settings

    def show(self, request: Request) -> Response:
        return Response.json(self.tunnel.data())

    def services(self, request: Request) -> Response:
        return Response.json([self.tunnel.service()] if self.tunnel.is_wanted(datetime.now(timezone.utc)) else [])

    def check(self, request: Request) -> Response:
        self.tunler.drop()
        return Response.json(self.tunnel.data())

    def restart(self, request: Request) -> Response:
        self.tunler.drop()
        self.tunnel.restart()
        return Response.json(self.tunnel.data())

    def cause(self, request: Request) -> Response:
        return Response.json(asdict(self.tunnel.cause()))

    def status(self, request: Request) -> Response:
        return Response.json({"reachable": self.tunnel.is_responsive()})

    def login(self, request: Request) -> Response:
        body = request.body
        host = str(body.get("endpoint", "")).strip() or self.tunnel.host()
        produced = self.tunler.login(host, str(body.get("username", "")).strip(), str(body.get("password", "")), str(body.get("master_password", "")))
        if produced.connected:
            self.settings.set(Sharing.HOST.key, host, request.actor)
            self.tunnel.reconcile()
        return Response.json({**asdict(produced), **self.tunnel.data()})

    def logout(self, request: Request) -> Response:
        self.tunler.logout()
        self.tunnel.stop()
        return Response.json(self.tunnel.data())

    def version(self, request: Request) -> Response:
        return Response.json(asdict(self.tunler.versions(self.tunnel.host())))

    def install(self, request: Request) -> Response:
        server = str(request.body.get("host", "")).strip().removeprefix("https://").removeprefix("http://").split("/")[0]
        if not server:
            raise Rejection("give the address of the tunler server to install from, such as tunler.example.com")
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
