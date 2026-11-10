import re
from collections.abc import Sequence

from engine.driver.hook_reply import HookReply

NUMBER = re.compile(r"\d+")
REFUSED = ", refused"


class StoryPath:
    """Writes a step of a story as what it did and what came of it, without the values it was given, so two
    stories that do the same thing read the same."""

    @staticmethod
    def command(actor_id: int, arguments: Sequence[str], code: int) -> str:
        flags = [argument.partition("=")[0] for argument in arguments if argument.startswith("--")]
        return f"{actor_id} runs {' '.join([*arguments[:2], *flags])}{REFUSED if code else ''}"

    @staticmethod
    def hook(action: str, reply: HookReply) -> list[str]:
        return [f"hook {action}{REFUSED if reply.refusal else ''}", *(f"told {NUMBER.sub('_', line)}" for line in reply.lines)]
