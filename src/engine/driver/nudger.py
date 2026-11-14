from abc import ABC, abstractmethod

from engine.command.context import Context
from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.model.model import Model


class Nudger(ABC):
    """Gives an agent a line outside a hook's own answer and returns the saved row of that line. Declared
    nudges keep their templates; other text is read by its row number. The drivers module binds the class
    that writes."""

    def send(self, agent_id: int, declaration: NudgeDeclaration, source: str, context: Context, **values: object) -> Model:
        return self.send_nudge(agent_id, declaration.nudge(**values), source, context)

    @abstractmethod
    def send_nudge(self, agent_id: int, nudge: Nudge, source: str, context: Context, wakes_agent: bool = False) -> Model: ...

    @abstractmethod
    def send_text(self, agent_id: int, text: str, source: str, context: Context, wakes_agent: bool = False, repeats_without_hook: bool = False) -> Model: ...
