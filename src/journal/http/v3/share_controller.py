from journal.features.sharing.tunnel import Tunnel
from journal.http.request import Request
from journal.http.response import Response
from journal.http.v3.action_body import ActionBody
from journal.http.v3.share_commands import ShareCommands
from journal.repositories.shares import Shares


class ShareController:
    """Sharing as a whole, apart from a link's own row: the viewer's commands to the tunnel and to tunler, and the tunnel as the service the top bar watches."""

    def __init__(self, commands: ShareCommands, tunnel: Tunnel, shares: Shares) -> None:
        self.commands, self.tunnel, self.shares = commands, tunnel, shares

    def command(self, request: Request) -> Response:
        action = request.params["action"]
        run = None if action.startswith("_") else getattr(self.commands, action, None)
        if run is None:
            return Response.refused(f"{action} is not something the viewer can ask of sharing here")
        return Response.json(run(ActionBody.from_payload(request.body), request.actor))

    def services(self, request: Request) -> Response:
        """The tunnel while a link is open; nothing while none is, so the top bar says nothing is shared."""
        return Response.json([self.tunnel.service()] if self.shares.open_anywhere() else [])
