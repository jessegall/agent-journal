import re
from collections.abc import Sequence
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.block_condition import BlockCondition
from engine.driver.open_hold import OpenHold
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.interval import Interval
from engine.driver.agent_message import AgentMessage
from core.modules.drivers.support.driver_agent_messages import REQUIRED_COMMAND_COUNTDOWN, REQUIRED_COMMAND_SPAN
from core.modules.drivers.agent_messages.required_command_refusal_message import RequiredCommandRefusalMessage


class RequiredCommands:
    """Opens a block for each line said that declares the command paying it, once while it stays open: the
    agent has five tool uses to run the command, and is held after them until it does or skips it."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def open(self, agent_id: int, agent_messages: Sequence[AgentMessage], context: Context) -> None:
        for agent_message in agent_messages:
            if agent_message.required_command:
                self.bus.dispatch(self.block(agent_id, agent_message), context)

    @staticmethod
    def block(agent_id: int, agent_message: AgentMessage) -> OpenHold:
        parts = agent_message.required_command.split()
        # the verb, the noun and the row it names, such as read output 4120: a flag after the row (--tail 5) is no row
        subject = " ".join(dict.fromkeys((*parts[2:3], parts[1], *parts[3:4])))
        refusal = RequiredCommandRefusalMessage.declared().agent_message(subject=subject, block="{block}")
        countdown = REQUIRED_COMMAND_COUNTDOWN.agent_message("{left}", subject=subject)
        return OpenHold(agent_id, replace(refusal, key=f"{refusal.key}:{agent_message.required_command}"), RequiredCommands.condition(agent_message), Interval(REQUIRED_COMMAND_SPAN), countdown)

    @staticmethod
    def condition(agent_message: AgentMessage) -> BlockCondition:
        closer = None if agent_message.declaration is None else agent_message.declaration.closed_by
        return RanCommand(agent_message.required_command) if closer is None else closer(re.search(r"\d+", agent_message.required_command).group())
