from journal.repositories.setting_rows import SettingRows
from journal.support.announced_commands import AnnouncedCommands
from journal.support.hook import Hook
from journal.support.hook_kind import HookKind
from journal.hooks.receiver import Receiver
from journal.hooks.support.tool_calls import ToolCalls
from journal.http.support.request import Request
from journal.support.response import Response
from journal.providers.providers import Providers

LAUNCH_HEADER = "x-journal-launch"
WORKER_HEADER = "x-journal-worker"
WORKER_TOKEN_HEADER = "x-journal-worker-token"


class HookController:
    def __init__(self, receiver: Receiver, providers: Providers, announced: AnnouncedCommands, calls: ToolCalls, settings: SettingRows) -> None:
        self.receiver, self.providers, self.announced, self.calls, self.settings = receiver, providers, announced, calls, settings

    def receive(self, request: Request) -> Response:
        parsed = Hook.parse(request.body, request.environment, request.params["agent"], request.headers.get(LAUNCH_HEADER, ""))
        stamp = request.headers.get("x-journal-hook-started")
        stamped = parsed.stamped(int(stamp)) if stamp else parsed
        worker = request.headers.get(WORKER_HEADER)
        hook = stamped.worker_hook(int(worker), request.headers.get(WORKER_TOKEN_HEADER)) if worker else stamped
        if hook.subagent and hook.kind == HookKind.PRE_TOOL_USE:
            return self.announce(hook)
        if hook.kind == HookKind.PRE_TOOL_USE:
            self.announced.withdraw(hook.environment, hook.session, self.shell_parts(hook))
        provider, decision = self.providers.lookup(hook.provider), self.receiver.receive(hook)
        return provider.answer(hook, decision) if self.is_copy_shown() else provider.agent_answer(hook, decision)

    def is_copy_shown(self) -> bool:
        from journal.features.faults.feature import Faults
        return bool(self.settings.option(Faults.HOOK_LINE_COPY))

    def announce(self, hook: Hook) -> Response:
        if parts := self.shell_parts(hook):
            self.announced.note(hook.environment, hook.session, parts)
        return Response.json({})

    def shell_parts(self, hook: Hook) -> tuple[str, ...]:
        return tuple(part.text for part in self.calls.build(hook).parts)
