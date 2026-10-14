from journal.hooks.hook import Hook
from journal.hooks.receiver import Receiver
from journal.http.request import Request
from journal.http.response import Response
from journal.providers.providers import Providers


class HookController:
    def __init__(self, receiver: Receiver, providers: Providers) -> None:
        self.receiver, self.providers = receiver, providers

    def receive(self, request: Request) -> Response:
        hook = Hook.parse(request.body, request.environment, request.params["agent"])
        return self.providers.named(hook.provider).answer(hook.kind, self.receiver.receive(hook))
