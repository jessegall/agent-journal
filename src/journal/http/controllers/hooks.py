from journal.support.announced_commands import AnnouncedCommands
from journal.support.hook import Hook
from journal.support.hook_kind import HookKind
from journal.hooks.receiver import Receiver
from journal.http.support.request import Request
from journal.support.response import Response
from journal.providers.providers import Providers


class HookController:
    def __init__(self, receiver: Receiver, providers: Providers, announced: AnnouncedCommands) -> None:
        self.receiver, self.providers, self.announced = receiver, providers, announced

    def receive(self, request: Request) -> Response:
        parsed = Hook.parse(request.body, request.environment, request.params["agent"])
        stamp = request.headers.get("x-journal-hook-started")
        hook = parsed.stamped(int(stamp)) if stamp else parsed
        if hook.subagent and hook.kind == HookKind.PRE_TOOL_USE:
            return self.announce(hook)
        if hook.kind == HookKind.PRE_TOOL_USE and hook.tool == "Bash":
            self.announced.withdraw(hook.environment, self.own_parts(hook))
        return self.providers.lookup(hook.provider).answer(hook, self.receiver.receive(hook))

    def announce(self, hook: Hook) -> Response:
        if hook.tool == "Bash":
            self.announced.note(hook.environment, self.own_parts(hook))
        return Response.json({})

    def own_parts(self, hook: Hook) -> tuple[str, ...]:
        return tuple(part.text for part in self.providers.lookup(hook.provider).call(hook.tool, hook.input).parts)
