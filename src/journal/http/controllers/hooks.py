from journal.support.announced_commands import AnnouncedCommands
from journal.support.hook import Hook
from journal.support.hook_kind import HookKind
from journal.hooks.receiver import Receiver
from journal.hooks.support.tool_calls import ToolCalls
from journal.http.support.request import Request
from journal.support.response import Response
from journal.providers.providers import Providers

LAUNCH_HEADER = "x-journal-launch"


class HookController:
    def __init__(self, receiver: Receiver, providers: Providers, announced: AnnouncedCommands, calls: ToolCalls) -> None:
        self.receiver, self.providers, self.announced, self.calls = receiver, providers, announced, calls

    def receive(self, request: Request) -> Response:
        parsed = Hook.parse(request.body, request.environment, request.params["agent"], request.headers.get(LAUNCH_HEADER, ""))
        stamp = request.headers.get("x-journal-hook-started")
        hook = parsed.stamped(int(stamp)) if stamp else parsed
        if hook.subagent and hook.kind == HookKind.PRE_TOOL_USE:
            return self.announce(hook)
        if hook.kind == HookKind.PRE_TOOL_USE:
            self.announced.withdraw(hook.environment, hook.session, self.shell_parts(hook))
        return self.providers.lookup(hook.provider).answer(hook, self.receiver.receive(hook))

    def announce(self, hook: Hook) -> Response:
        if parts := self.shell_parts(hook):
            self.announced.note(hook.environment, hook.session, parts)
        return Response.json({})

    def shell_parts(self, hook: Hook) -> tuple[str, ...]:
        return tuple(part.text for part in self.calls.build(hook).parts)
