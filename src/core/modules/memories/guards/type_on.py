from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.drivers.suite_choice import SuiteChoice
from core.modules.memories.memory import Memory
from core.modules.memories.memory_type_switch import MemoryTypeSwitch

EVERY_SUITE = "*"


class TypeOn(Guard):
    """A memory is made only of a type switched on for its environment's suite; a switch for the suite wins over
    the one for every suite."""

    name = "memories.type-on"
    event = "memory.create"

    def __init__(self, queries: Queries, choice: SuiteChoice) -> None:
        self.queries, self.choice = queries, choice

    def check(self, change: Change[Model]) -> None:
        memory = change.row
        if not isinstance(memory, Memory):
            return
        suite = self.choice.suite(memory.environment_id) if memory.environment_id is not None else None
        switches = {switch.suite: switch.is_on for switch in self.queries.query(MemoryTypeSwitch).filter(type=memory.type).all_rows()}
        is_on = switches.get(suite.name, switches.get(EVERY_SUITE, True)) if suite is not None else switches.get(EVERY_SUITE, True)
        if not is_on:
            raise Refusal(f"the memory type {memory.type} is switched off here", "journal memory-type list names the types that are on")
