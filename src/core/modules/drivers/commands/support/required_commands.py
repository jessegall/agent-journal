from collections.abc import Sequence
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.block_until import BlockUntil
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.interval import Interval
from engine.driver.nudge import Nudge
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_COUNTDOWN, REQUIRED_COMMAND_REFUSAL, REQUIRED_COMMAND_SPAN


class RequiredCommands:
    """Opens a block for each line said that declares the command paying it, once while it stays open: the agent has
    five tool uses to run the command, and is held after them until it does or skips it."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def open(self, agent_id: int, nudges: Sequence[Nudge], context: Context) -> None:
        for nudge in nudges:
            if nudge.required_command:
                self.bus.dispatch(self.block(agent_id, nudge), context)

    @staticmethod
    def block(agent_id: int, nudge: Nudge) -> BlockUntil:
        parts = nudge.required_command.split()
        # the verb, the noun and the row it names, such as read output 4120: a flag after the row (--tail 5) is no row
        subject = " ".join(dict.fromkeys((*parts[2:3], parts[1], *parts[3:4])))
        refusal = REQUIRED_COMMAND_REFUSAL.nudge(subject=subject, block="{block}")
        countdown = REQUIRED_COMMAND_COUNTDOWN.nudge("{left}", subject=subject)
        return BlockUntil(agent_id, replace(refusal, key=f"{refusal.key}:{nudge.required_command}"), RanCommand(nudge.required_command), Interval(REQUIRED_COMMAND_SPAN), countdown)
