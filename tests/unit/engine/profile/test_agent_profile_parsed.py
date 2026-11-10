from dataclasses import asdict

import pytest

from engine.profile.agent_profile import AgentProfile
from engine.enums.occupant import Occupant


def stored_fields(**changed: object) -> dict:
    fields = asdict(AgentProfile("notes-reader"))
    del fields["occupant"]
    return {**fields, **changed}


def test_a_stored_independent_switch_restores_as_its_occupant():
    assert AgentProfile.parsed(stored_fields(independent=True)).occupant is Occupant.LAUNCH_ROTATION
    assert AgentProfile.parsed(stored_fields(independent=False)).occupant is Occupant.COLD_ROTATION


def test_a_stored_occupant_word_restores_as_the_enum():
    assert AgentProfile.parsed(stored_fields(occupant="continue")).occupant is Occupant.CONTINUE


def test_a_stored_reuse_word_is_refused():
    with pytest.raises(ValueError, match="agents are kept; a person retires them"):
        AgentProfile.parsed(stored_fields(reuse="never"))


def test_a_profile_with_neither_field_is_when_cold_and_not_independent():
    profile = AgentProfile.parsed(stored_fields())
    assert (profile.occupant, profile.independent) == (Occupant.COLD_ROTATION, False)
