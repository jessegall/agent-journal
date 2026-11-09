from typing import ClassVar

from core.base.actor_type import ActorType
from core.base.change.deleted import Deleted
from core.base.change.event_subscriber import E
from core.base.command.context import Context
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.base.user_approval_refusal import UserApprovalRefusal


class PersonRowGuard(Guard[E]):
    """Refuses a viewer row of a person's own, a layout, a person's preset or a window permission, written by
    anyone but the person it is for; each subclass names its model and its refusal."""

    refusal: ClassVar[Refusal]
    question: ClassVar[str] = "Allow this change?"
    is_safety = True

    def person_id(self, event: E) -> int:
        raise NotImplementedError(f"{type(self).__name__} names no person")

    def check(self, event: E, context: Context) -> None:
        person_id = self.person_id(event)
        if isinstance(event, Deleted) and context.actor.type in (ActorType.CORE, ActorType.MODULE):
            return
        actor = context.actor
        if actor.type is ActorType.AGENT:
            raise UserApprovalRefusal(self.question, required_person_id=person_id, command=context.command)
        if actor.type is not ActorType.USER or actor.id != person_id:
            raise self.refusal
