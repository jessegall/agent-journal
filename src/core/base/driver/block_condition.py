from typing import ClassVar

from core.base.driver.agent_hook import AgentHook


class BlockCondition:
    """What ends a block on an agent. A block outlives its process, so a condition is a class with its fields
    as text, stored by its name and built again from them."""

    name: ClassVar[str]

    @property
    def text(self) -> str:
        raise NotImplementedError

    def is_true(self, hook: AgentHook) -> bool:
        raise NotImplementedError
