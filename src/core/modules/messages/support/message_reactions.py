import json
import re
from collections.abc import Mapping, Sequence

from core.base.actor import Actor
from core.base.type_guards import is_list, is_mapping
from core.modules.messages.models.message import Message

EMOJI_TEXT = re.compile(r"^[\s\U0001F000-\U0001FAFF☀-➿️‍]+$")


class MessageReactions:
    """The faces put on a message, each with the actor and the type of actor, kept as JSON on the message;
    putting the
    same face again takes it off."""

    @staticmethod
    def decoded(message: Message) -> Sequence[Mapping[str, object]]:
        decoded: object = json.loads(message.reactions)
        return [{str(name): value for name, value in row.items()} for row in decoded if is_mapping(row)] if is_list(decoded) else []

    @staticmethod
    def toggled(message: Message, actor: Actor, emoji: str) -> str:
        reactions = json.loads(message.reactions)
        kept = [reaction for reaction in reactions if (reaction["emoji"], reaction["actor_id"]) != (emoji, actor.id)]
        return json.dumps(kept if len(kept) != len(reactions) else [*reactions, {"emoji": emoji, "actor_id": actor.id, "actor_type": actor.type.value}])

    @staticmethod
    def has_actor(message: Message, actor_type: str) -> bool:
        return any(reaction["actor_type"] == actor_type for reaction in json.loads(message.reactions))

    @staticmethod
    def is_emoji(text: str) -> bool:
        return bool(text.strip()) and bool(EMOJI_TEXT.match(text))
