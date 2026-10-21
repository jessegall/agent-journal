from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.triggers.commands.trigger_command import TriggerCommand
from journal.features.triggers.listeners.watch_prompt import WatchPrompt
from journal.features.triggers.listeners.watch_message import WatchMessage
from journal.features.triggers.listeners.watch_tool import WatchTool
from journal.features.triggers.support.triggers_conduct import TriggersConduct
from journal.features.triggers.support.triggers_data_reader import TriggersDataReader
from journal.features.triggers.support.triggers_data import TriggersData


class Triggers(Feature[TriggersData]):
    name = "triggers"
    title = "Triggers"
    help = "Words you choose, and what the journal does when one comes up."
    commands = (TriggerCommand,)
    listeners = (WatchPrompt, WatchTool, WatchMessage)
    data = (TriggersDataReader,)
    conduct = (TriggersConduct,)

    NUDGE = Nudge(name, "nudge", "{{title}}")
    INSTRUCT = Nudge(name, "instruct", "do this now: {{title}}", repeat_after=0)
    DENIED = Nudge(name, "denied", "a trigger denies this: {{title}}", repeat_after=0)
    nudges = (NUDGE, INSTRUCT, DENIED)
