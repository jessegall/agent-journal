from core.base.change.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_hooks import ManagedHooks
from core.modules.settings.commands.set_managed_hook.set_managed_hook import SetManagedHook


class SetManagedHookHandler(Handler[SetManagedHook, ManagedHook]):
    """Saves the hook's controls and records the changed managed file."""

    command = SetManagedHook

    def __init__(self, managed: ManagedHooks, events: EventLog) -> None:
        self.managed, self.events = managed, events

    def handle(self, command: SetManagedHook, context: Context) -> ManagedHook:
        hook = self.managed.changed(command.hook_id, command.state, command.timeout)
        self.events.write_file_change("managed-hook.changed", self.managed.path, context)
        return hook
