import json

from server.viewer.phone_sessions import PhoneSessions
from server.errors.viewer_request_error import ViewerRequestError


class PushRoute:
    """GET and POST /api/push, kept with the phone sessions: the public key a phone subscribes to notices
    with, and the subscription it gives back, which the phone module keeps on the paired phone of the session.
    A share session has no phone and gets neither."""

    def __init__(self, phones: PhoneSessions) -> None:
        self.phones = phones

    def public_key(self) -> str:
        return self.phones.push_key()

    def subscribe(self, token: str, body: bytes) -> None:
        try:
            subscription = json.loads(body or b"{}")
        except ValueError as error:
            raise ViewerRequestError("a subscription is a JSON object") from error
        self.phones.subscribed(token, json.dumps(subscription))
