from engine.enums.actor_type import ActorType
from core.base.change.changed import Changed
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.helpers.models.usage_limit import UsageLimit


class UsageCapGuard(Guard[Changed[UsageLimit]]):
    """A usage limit is a person's own: an agent neither sets, changes nor removes one."""

    name = "helpers.person-limits"
    is_safety = True

    def check(self, event: Changed[UsageLimit], context: Context) -> None:
        if context.actor.type is ActorType.AGENT:
            raise Refusal("an agent cannot set, change or remove a usage limit")
