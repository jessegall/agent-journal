from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.states.reader_request_states import READER_REQUEST_KEY
from core.modules.processes.support.reading.reader_request_blocks import ReaderRequestBlocks


class ReaderRequestEffect(EventEffect):
    """At the main agent's minute step, sends it a notice of each reader request that needs its help."""

    key = READER_REQUEST_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, blocks: ReaderRequestBlocks) -> None:
        self.blocks = blocks

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.blocks.answer(event, agent_id).commands
