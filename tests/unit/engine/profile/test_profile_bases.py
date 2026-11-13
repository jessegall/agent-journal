import pytest

from engine.enums.model_tier import ModelTier
from engine.errors.refusal import Refusal
from engine.profile.agent_profile import AgentProfile
from engine.profile.profile_bases import ProfileBases

BASE = AgentProfile("base", "The shared body", "Shared lines.", model="sonnet", tier=ModelTier.GENERAL, skills=("journal", "journal-tasks"))


def built(*profiles: AgentProfile) -> dict[str, AgentProfile]:
    return {profile.name: profile for profile in ProfileBases(profiles).built()}


def test_a_profile_has_the_body_of_its_base_and_its_own_lines_after_it():
    profiles = built(BASE, AgentProfile("child", "Child", "Own lines.", base="base"))
    assert profiles["child"].body == "Shared lines.\n\nOwn lines."


def test_a_change_to_the_base_reaches_the_profile_built_on_it():
    changed = AgentProfile("base", "The shared body", "Changed lines.", model="sonnet")
    assert built(changed, AgentProfile("child", "Child", "Own lines.", base="base"))["child"].body == "Changed lines.\n\nOwn lines."


def test_a_profile_keeps_the_settings_it_sets_and_takes_the_others_from_its_base():
    child = built(BASE, AgentProfile("child", "Child", "Own.", base="base", model="opus"))["child"]
    assert (child.model, child.tier, child.skills) == ("opus", ModelTier.GENERAL, ("journal", "journal-tasks"))


def test_bases_pass_down_through_a_chain():
    profiles = built(BASE, AgentProfile("middle", "Middle", "Middle lines.", base="base"), AgentProfile("last", "Last", "Last lines.", base="middle"))
    assert (profiles["last"].body, profiles["last"].model) == ("Shared lines.\n\nMiddle lines.\n\nLast lines.", "sonnet")


def test_a_profile_with_no_base_is_left_as_it_is():
    assert built(BASE)["base"] == BASE


def test_a_base_that_is_not_registered_is_refused():
    with pytest.raises(Refusal, match="profile child names the base gone, which no module registers"):
        built(AgentProfile("child", "Child", "Own.", base="gone"))


def test_bases_that_lead_back_to_the_profile_are_refused():
    with pytest.raises(Refusal, match="lead back to it: a -> b -> a"):
        built(AgentProfile("a", "A", "A.", base="b"), AgentProfile("b", "B", "B.", base="a"))


def test_a_profile_sets_a_setting_back_to_its_default_over_its_base_by_naming_it():
    child = built(BASE, AgentProfile("child", "Child", "Own.", base="base", default_fields=("model", "tier")))["child"]
    assert (child.model, child.tier, child.skills) == ("", None, ("journal", "journal-tasks"))


def test_a_profile_requires_every_skill_its_base_requires_and_its_own_on_top():
    base = AgentProfile("base", "The shared body", "Shared lines.", skills=("journal", "journal-tasks"), required_skills=tuple(["journal"]), is_base=True)
    child = AgentProfile("child", "Child", "Own lines.", base="base", skills=("journal", "journal-tasks"), required_skills=tuple(["journal-tasks"]))
    profiles = built(base, child)
    assert profiles["child"].required_skills == ("journal", "journal-tasks")
    assert profiles["child"].is_base is False
    assert profiles["base"].is_base is True
