from journal.hooks.hook import Hook
from journal.hooks.receiver import Receiver
from journal.http.request import Request
from journal.http.response import Response


class HookController:
    def __init__(self, receiver: Receiver) -> None:
        self.receiver = receiver

    def receive(self, request: Request) -> Response:
        decision = self.receiver.receive(Hook.parse(request.body, request.environment))
        return Response(decision.status, decision.as_hook_output())
