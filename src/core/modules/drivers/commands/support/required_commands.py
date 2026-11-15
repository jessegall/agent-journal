import re
from collections.abc import Sequence
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.block_condition import BlockCondition
from engine.driver.block_until import BlockUntil
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.interval import Interval
from engine.driver.nudge import Nudge
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_COUNTDOWN, REQUIRED_COMMAND_SPAN
from core.modules.drivers.nudges.required_command_refusal_nudge import RequiredCommandRefusalNudge


class RequiredCommands:
    """Opens a block for each line said that declares the command paying it, once while it stays open: the
    agent has five tool uses to run the command, and is held after them until it does or skips it."""

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
        refusal = RequiredCommandRefusalNudge.declared().nudge(subject=subject, block="{block}")
        countdown = REQUIRED_COMMAND_COUNTDOWN.nudge("{left}", subject=subject)
        return BlockUntil(agent_id, replace(refusal, key=f"{refusal.key}:{nudge.required_command}"), RequiredCommands.condition(nudge), Interval(REQUIRED_COMMAND_SPAN), countdown)

    @staticmethod
    def condition(nudge: Nudge) -> BlockCondition:
        closer = None if nudge.declaration is None else nudge.declaration.closed_by
        return RanCommand(nudge.required_command) if closer is None else closer(re.search(r"\d+", nudge.required_command).group())
