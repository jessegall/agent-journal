from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class MenuAnswer(Model):
    """What the launcher pressed on a menu in an agent's terminal: the menu's question and the answer."""

    model_name = "menu_answer"
    cli_name = "menu-answer"

    session_agent_id: int
    creator_id: int
    question: str
    answer: str
