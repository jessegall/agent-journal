from collections.abc import Sequence
from typing import ClassVar

from engine.agent.enums.role_group import RoleGroup
from engine.command.command import Command
from engine.container.single_instance import SingleInstance
from engine.driver.hook_call_like import HookCallLike
from engine.enums.hook_event_name import HookEventName
from engine.enums.hook_wildcard import HookWildcard


class DeferredRule(SingleInstance):
    """A rule of a deferred state: it is asked after the hook's answer is sent, with the hook call the
    journal stored for it, and answers the commands to run then. It cannot refuse or rewrite, since the
    answer is gone, so it declares no single-action refusal. It takes the stored row, not the hook, because
    a hook cannot be rebuilt from it."""

    name: ClassVar[str]
    hook: ClassVar[HookEventName | HookWildcard]
    drivers: ClassVar[Sequence[str]] = ["*"]
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY

    def after(self, call: HookCallLike) -> Sequence[Command[object]]:
        raise NotImplementedError
