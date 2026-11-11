from types import SimpleNamespace

from engine.enums.occupant import Occupant
from engine.module.profile_check import ProfileCheck

TYPES = {"helper": SimpleNamespace(label="helper", access=None, start_line=""),
         "worker": SimpleNamespace(label="worker", access=None, start_line="journal worker dispatch")}


def problems(agent_type: str, occupant: Occupant) -> list[str]:
    profile = SimpleNamespace(name="reader", description="Reads", body="Read.", agent_type=agent_type, access=None, occupant=occupant)
    return ProfileCheck().profile_problems("notes", profile, TYPES, {})


def test_a_type_with_its_own_start_line_cannot_declare_an_occupant():
    assert problems("worker", Occupant.LAUNCH_ROTATION) == ["profile reader declares an occupant, and a worker starts through journal worker dispatch, which decides its sessions"]


def test_a_type_with_its_own_start_line_and_the_default_occupant_has_no_problem():
    assert problems("worker", Occupant.COLD_ROTATION) == []


def test_a_helper_may_declare_any_occupant():
    assert [problems("helper", occupant) for occupant in Occupant] == [[], [], []]
