from features.linear.webhook import SIGNATURE
from resources.base import Refused

WEBHOOK_BODY = 256 * 1024


class LinearWebhook:
    """The address Linear delivers its events to, on the share server, answering only while Linear is on."""

    def __init__(self, feature):
        self.feature = feature

    def get(self, handler, rest: list[str]) -> None:
        handler.send(404, b"", {})

    def post(self, handler, rest: list[str]) -> None:
        if rest != ["webhook"]:
            return handler.send(404, b"", {})
        size = int(handler.headers.get("Content-Length", 0))
        if size > WEBHOOK_BODY:
            return handler.send(413, b"", {})
        try:
            self.feature.take(handler.shares.record, handler.rfile.read(size), handler.headers.get(SIGNATURE, ""))
        except Refused:
            return handler.send(401, b"", {})
        handler.send(200, b"{}", {"Content-Type": "application/json"})
