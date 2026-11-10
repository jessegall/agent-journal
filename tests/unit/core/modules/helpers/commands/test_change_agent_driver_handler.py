from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.helpers.commands.change_agent_driver.change_agent_driver import ChangeAgentDriver
from core.modules.helpers.commands.change_agent_driver.change_agent_driver_handler import ChangeAgentDriverHandler
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal

ENDED_AT = datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc)
PERSON = Actor(3, ActorType.USER)
TO_CODEX = ChangeAgentDriver(7, "codex", "gpt-6.1-sol")


class DriverChange:
    """The handler on recording stand-ins: the commands it ran and the model checks it asked for."""

    def __init__(self, allowed_models: tuple[str, ...] = ("gpt-6.1-sol",), **agent_changes: object) -> None:
        self.commands: list[object] = []
        self.allowed_models = allowed_models
        fields = {"id": 7, "number": 4, "role": "helper", "profile": "journal-researcher", "program": "claude", "program_model": "sonnet", "ended_at": ENDED_AT, "retired_at": None}
        self.agent = SimpleNamespace(**{**fields, **agent_changes})
        self.handler = ChangeAgentDriverHandler(SimpleNamespace(required=lambda model, row_id: self.agent), SimpleNamespace(run_with_context=self.run),
                                                SimpleNamespace(checked_model=self.checked_model), SimpleNamespace(check=lambda actor: None))

    def run(self, command, context) -> SimpleNamespace:
        self.commands.append(command)
        return self.agent

    def checked_model(self, agent_type: str, profile: str, program: str, model: str) -> None:
        if model not in self.allowed_models:
            raise Refusal(f"{profile} does not allow {model}", f"allowed: {', '.join(self.allowed_models)}")


def test_a_stopped_agent_gets_a_new_session_on_the_named_program_and_model_closed_as_a_driver_change():
    change = DriverChange()
    change.handler.prepare(TO_CODEX, PERSON)
    change.handler.handle(TO_CODEX, SimpleNamespace(actor=PERSON))
    assert change.commands == [ReplaceAgentSession(7, EndReason.DRIVER_CHANGED, "codex", "gpt-6.1-sol")]


def test_a_running_agent_is_refused_naming_the_stop_that_comes_first():
    change = DriverChange(ended_at=None)
    with pytest.raises(Refusal) as refused:
        change.handler.prepare(TO_CODEX, PERSON)
    assert refused.value.text == "helper 4 is running: journal agent stop 4, then change its driver"
    assert change.commands == []


def test_a_model_the_profile_does_not_allow_is_refused_with_the_allowed_models():
    change = DriverChange(allowed_models=("sonnet", "opus"))
    with pytest.raises(Refusal) as refused:
        change.handler.prepare(TO_CODEX, PERSON)
    assert refused.value.text == "journal-researcher does not allow gpt-6.1-sol: allowed: sonnet, opus"
    assert change.commands == []


def test_a_retired_agent_is_refused():
    change = DriverChange(retired_at=ENDED_AT)
    with pytest.raises(Refusal, match="helper 4 is retired, for good"):
        change.handler.prepare(TO_CODEX, PERSON)
