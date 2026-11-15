from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
import re

from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.nudges.plain_block_nudge import PlainBlockNudge
from core.modules.tasks.nudges.wait_description_nudge import WaitDescriptionNudge
from core.modules.tasks.support.task_wait_targets import TaskWaitTargets


WAIT_TERMS = re.compile(r"\b(wait(s|ing)?\s+(for|on|until)|blocked\s+(on|by|until))\b", re.I)
DESCRIBING_COMMANDS = ("task log", "task block", "message send", "message reply")
BLOCK_FLAGS = ("--on", "--until")


class WaitInWordsLines(EventLineSource):
    """A log line, a block's reason or a message that says the work waits, in words, teaches the block that
    opens by itself."""

    key = "tasks.wait-in-words"
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, targets: TaskWaitTargets) -> None:
        self.targets = targets

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        shell = event.tool.shell if event.tool is not None else None
        described = shell.parts_running_journal_command(*DESCRIBING_COMMANDS) if shell is not None else ()
        if any(part.arguments[:2] == ("task", "block") and any(arg == "--reason" or arg.startswith("--reason=") for arg in part.arguments)
               and not any(arg.split("=", 1)[0] in (*BLOCK_FLAGS, "--until-user") for arg in part.arguments) for part in described):
            return [PlainBlockNudge.declared().nudge(targets=", ".join(self.targets.target_types))]
        if not any(WAIT_TERMS.search(part.text) and not set(BLOCK_FLAGS) & set(part.arguments) for part in described):
            return []
        return [WaitDescriptionNudge.declared().nudge()]
