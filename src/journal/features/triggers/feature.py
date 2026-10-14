from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.triggers.commands.trigger_command import TriggerCommand
from journal.features.triggers.listeners.watch_prompt import WatchPrompt
from journal.features.triggers.listeners.watch_tool import WatchTool


class Triggers(Feature):
    name = "triggers"
    title = "Triggers"
    commands = (TriggerCommand,)
    listeners = (WatchPrompt, WatchTool)

    NUDGE = Nudge(name, "nudge", "{{title}}")
    INSTRUCT = Nudge(name, "instruct", "do this now: {{title}}", repeat_after=0)
    DENIED = Nudge(name, "denied", "a trigger denies this: {{title}}", repeat_after=0)
    nudges = (NUDGE, INSTRUCT, DENIED)
