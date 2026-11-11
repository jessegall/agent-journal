from types import SimpleNamespace

import pytest

from engine.enums.occupant import Occupant
from engine.errors.refusal import Refusal
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.helpers.support.helper_program import HelperProgram
from core.modules.helpers.support.occupant_rotation import OccupantRotation

HELPER = SimpleNamespace(id=7, profile="reader")
PARENT = SimpleNamespace(id=1)


class RecordingBus:
    def __init__(self) -> None:
        self.commands: list[object] = []

    def dispatch(self, command, context):
        self.commands.append(command)
        return SimpleNamespace(id=command.row_id, program=command.program)


def refusing(profile_name: str) -> None:
    raise Refusal("stopped helper sessions may not resume")


def rotation(occupant: Occupant, checked_resume=lambda profile_name: None) -> tuple[OccupantRotation, RecordingBus]:
    profile = SimpleNamespace(name="reader", occupant=occupant)
    bus = RecordingBus()
    choice = SimpleNamespace(startable=lambda profile, parent, requested: HelperProgram("codex", "gpt-6.1-terra"))
    return OccupantRotation(SimpleNamespace(effective=lambda name: profile), SimpleNamespace(checked_resume=checked_resume), choice, SimpleNamespace(find=lambda row_id: PARENT), bus), bus


@pytest.mark.parametrize("occupant", [Occupant.CONTINUE, Occupant.COLD_ROTATION])
def test_a_profile_that_keeps_its_session_between_launches_has_no_rotation(occupant):
    assert rotation(occupant)[0].profile(HELPER) is None


def test_a_helper_with_no_profile_has_no_rotation():
    assert rotation(Occupant.LAUNCH_ROTATION)[0].profile(SimpleNamespace(id=7, profile="")) is None


def test_an_each_launch_profile_replaces_the_session_on_the_chosen_program_with_its_reason():
    occupants, bus = rotation(Occupant.LAUNCH_ROTATION)
    replaced = occupants.rotated(HELPER, occupants.profile(HELPER), 1, None)
    command = bus.commands[0]
    assert (command.row_id, command.reason, command.program, command.program_model) == (7, EndReason.LAUNCH_ROTATION, "codex", "gpt-6.1-terra")
    assert replaced.program == "codex"


def test_resume_switched_off_refuses_before_any_session_is_replaced():
    occupants, bus = rotation(Occupant.LAUNCH_ROTATION, refusing)
    with pytest.raises(Refusal):
        occupants.rotated(HELPER, occupants.profile(HELPER), 1, None)
    assert bus.commands == []
