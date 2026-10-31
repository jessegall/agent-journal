from enum import StrEnum


class ButtonWindow(StrEnum):
    """The windows whose allowed lines gain the buttons modules declare: the chat window for mark buttons and the dock
    for dock buttons."""

    MARKS = "messages.chat"
    DOCK = "docking.dock"
