import re
from collections.abc import Sequence

from engine.driver.hook_reply import HookReply

NUMBER = re.compile(r"\d+")
REFUSED = ", refused"


class StoryPath:
    """Writes a step of a story as what it did and what came of it, without the values it was given, so two
    stories that do the same thing read the same. A refusal keeps the first line of its reason, without its
    numbers: two refusals for different reasons are different outcomes."""

    @staticmethod
    def command(actor_id: int, arguments: Sequence[str], code: int, output: str = "") -> str:
        flags = [argument.partition("=")[0] for argument in arguments if argument.startswith("--")]
        return f"{actor_id} runs {' '.join([*arguments[:2], *flags])}{StoryPath.refused(output) if code else ''}"

    @staticmethod
    def hook(action: str, reply: HookReply) -> list[str]:
        refused = StoryPath.refused(reply.refusal) if reply.refusal else ""
        return [f"hook {action}{refused}", *(f"told {NUMBER.sub('_', line)}" for line in reply.lines)]

    @staticmethod
    def refused(reason: str) -> str:
        first_line = reason.strip().partition("\n")[0]
        return f"{REFUSED}: {NUMBER.sub('_', first_line)}"
