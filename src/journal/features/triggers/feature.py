from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.triggers.commands.trigger_command import TriggerCommand
from journal.features.triggers.listeners.watch_prompt import WatchPrompt
from journal.features.triggers.listeners.watch_message import WatchMessage
from journal.features.triggers.listeners.watch_tool import WatchTool


class Triggers(Feature):
    name = "triggers"
    title = "Triggers"
    help = "Words you choose, and what the journal does when one comes up."
    commands = (TriggerCommand,)
    listeners = (WatchPrompt, WatchTool, WatchMessage)

    NUDGE = Nudge(name, "nudge", "{{title}}")
    INSTRUCT = Nudge(name, "instruct", "do this now: {{title}}", repeat_after=0)
    DENIED = Nudge(name, "denied", "a trigger denies this: {{title}}", repeat_after=0)
    nudges = (NUDGE, INSTRUCT, DENIED)
