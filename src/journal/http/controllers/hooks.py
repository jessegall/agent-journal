from journal.hooks.receiver import Receiver
from journal.http.request import Request, Response


class HookController:
    def __init__(self, receiver: Receiver) -> None: ...

    def receive(self, request: Request) -> Response: ...
