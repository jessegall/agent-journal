from contextlib import nullcontext
from types import SimpleNamespace

from engine.errors.refusal import Refusal
from core.modules.drivers.bindings.stored_step_writer import StoredStepWriter


class Effect:
    is_required = False

    def __init__(self, *commands: object) -> None:
        self.given = commands

    def commands(self, view: object, record: object) -> tuple[object, ...]:
        return self.given

    def input_after(self, view: object, record: object, results: object) -> None:
        return None


def test_an_effect_whose_command_is_refused_is_logged_and_the_effects_after_it_still_run():
    ran: list[str] = []

    def dispatch(command: str, context: object) -> str:
        if command == "refused":
            raise Refusal("the row is gone")
        ran.append(command)
        return command

    writer = StoredStepWriter(SimpleNamespace(), SimpleNamespace(), SimpleNamespace(dispatch=dispatch), SimpleNamespace(savepoint=lambda name: nullcontext()),
                              SimpleNamespace(), SimpleNamespace(), SimpleNamespace(), SimpleNamespace(of=lambda effect, view, record: effect.commands(view, record)), SimpleNamespace(), SimpleNamespace(), SimpleNamespace())
    failures, _ = writer.run_effects([Effect("refused"), Effect("kept")], SimpleNamespace(), SimpleNamespace(), False, SimpleNamespace(nested=lambda command: None))
    assert ran == ["kept"] and len(failures) == 1 and "the row is gone" in failures[0]
