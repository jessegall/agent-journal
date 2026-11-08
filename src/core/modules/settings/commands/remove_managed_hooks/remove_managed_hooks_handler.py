from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_hooks import ManagedHooks
from core.modules.settings.commands.remove_managed_hooks.remove_managed_hooks import RemoveManagedHooks


class RemoveManagedHooksHandler(Handler[RemoveManagedHooks, list[ManagedHook]]):
    """Takes the stamped hooks out of the managed file and records the changed file when any went."""

    command = RemoveManagedHooks

    def __init__(self, managed: ManagedHooks, events: EventLog) -> None:
        self.managed, self.events = managed, events

    def handle(self, command: RemoveManagedHooks, context: Context) -> list[ManagedHook]:
        removed = self.managed.removed_by_stamp(command.stamp)
        if removed:
            self.events.write_file_change("managed-hook.changed", self.managed.path, context)
        return removed
