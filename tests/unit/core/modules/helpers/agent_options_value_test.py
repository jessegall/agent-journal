import math

import pytest

from core.modules.helpers.support.agent_field_options import AgentFieldOptions
from core.modules.helpers.support.agent_options_value import AgentOptionsValue
from core.modules.helpers.support.command_pair_rule import CommandPairRule
from engine.setting.list_rule import ListRule
from core.modules.helpers.support.malformed_agent_options import MalformedAgentOptions
from engine.setting.number_rule import NumberRule

AGENT_TYPES = ("worker", "helper")


def parsed(*lines: str) -> AgentOptionsValue:
    return AgentOptionsValue.parse(lines, AGENT_TYPES)


def test_no_lines_leave_every_field_at_its_fresh_default():
    options = parsed().effective_options("worker", "journal-worker")
    assert options == AgentFieldOptions()
    assert (options.allow_new, options.allow_resume) == (True, True)
    assert (options.allowed_profiles, options.allowed_providers, options.allowed_models, options.model_defaults) == (None, None, None, None)
    assert (options.max_minutes, options.max_cost) == (None, None)


def test_a_kind_line_sets_its_field_for_every_profile_of_the_kind():
    value = parsed("helper allow_new=off", "helper allowed_providers=claude,codex", "helper max_minutes=30", "helper max_cost=1.5")
    options = value.effective_options("helper", "journal-researcher")
    assert (options.allow_new, options.allowed_providers, options.max_minutes, options.max_cost) == (False, ("claude", "codex"), 30, 1.5)
    assert value.effective_options("worker", "journal-worker") == AgentFieldOptions()


def test_a_profile_line_wins_only_for_the_fields_it_names():
    value = parsed("helper allow_new=off", "helper allow_resume=off", "helper:journal-merger allow_new=on")
    merger = value.effective_options("helper", "journal-merger")
    assert (merger.allow_new, merger.allow_resume) == (True, False)


def test_an_empty_list_value_is_an_explicit_empty_list_and_a_missing_line_inherits():
    value = parsed("worker allowed_profiles=")
    assert value.effective_options("worker", "journal-worker").allowed_profiles == ()
    assert value.effective_options("helper", "journal-researcher").allowed_profiles is None


def test_models_and_defaults_must_belong_to_an_allowed_provider():
    assert parsed("worker allowed_providers=claude", "worker allowed_models=claude:opus", "worker model_defaults=claude:opus")
    assert AgentOptionsValue.problems(["worker allowed_providers=claude", "worker allowed_models=codex:gpt"], AGENT_TYPES)
    assert AgentOptionsValue.problems(["worker allowed_models=claude:opus", "worker model_defaults=claude:haiku"], AGENT_TYPES)
    assert AgentOptionsValue.problems(["worker model_defaults=claude:opus,claude:haiku"], AGENT_TYPES)


MALFORMED_LINES = ["worker", "worker allow_new", "pilot allow_new=on", "worker allow_new=1", "worker allow_new=on yes", "worker colour=red",
                   "worker max_minutes=1.5", "worker max_minutes=-1", "worker max_cost=nan", "worker max_cost=inf", "worker max_cost=-0.5",
                   "worker allowed_models=claude", "worker allowed_profiles=a,a", "worker allowed_providers=two words"]


def test_a_malformed_line_is_refused_with_its_reason():
    for line in MALFORMED_LINES:
        with pytest.raises(MalformedAgentOptions, match="not valid"):
            parsed(line)


def test_the_same_field_set_twice_for_one_target_is_refused():
    assert AgentOptionsValue.problems(["worker allow_new=on", "worker allow_new=off"], AGENT_TYPES)
    assert not AgentOptionsValue.problems(["worker allow_new=on", "worker:journal-worker allow_new=off"], AGENT_TYPES)


def test_a_whole_number_rule_refuses_what_is_not_a_whole_number_in_range():
    for value in [-1, 1.5, "3", True, math.nan, math.inf]:
        assert list(NumberRule(0).problems("limit", value)), value


def test_a_number_rule_accepts_its_edges_and_a_fraction_when_allowed():
    assert not list(NumberRule(0).problems("limit", 0))
    assert not list(NumberRule(0, maximum=100).problems("percent", 100))
    assert list(NumberRule(0, maximum=100).problems("percent", 101))
    assert not list(NumberRule(0, integer=False).problems("cost", 0.25))
    assert list(NumberRule(0, integer=False, exclusive=True).problems("hours", 0))
    assert not list(NumberRule(0, integer=False, exclusive=True).problems("hours", 0.5))


def test_a_list_rule_refuses_blank_repeated_misshapen_and_unlisted_lines():
    assert not list(ListRule().problems("commands", ()))
    assert not list(ListRule().problems("commands", ("git push", "echo done")))
    assert list(ListRule().problems("commands", ["git push", " "]))
    assert list(ListRule().problems("commands", ["git push", "git push"]))
    assert list(ListRule().problems("commands", "git push"))
    assert list(ListRule(pattern=r"\S+ \d+").problems("split", ["claude"]))
    assert list(ListRule(choices=("read", "edit")).problems("types", ["deploy"]))


def test_a_list_rule_with_a_total_adds_the_numbers_at_the_ends():
    split = ListRule(pattern=r"\S+ \d+", total=100)
    assert not list(split.problems("split", ["claude 80", "codex 20"]))
    assert not list(split.problems("split", []))
    assert list(split.problems("split", ["claude 60", "codex 30"]))


def test_two_commands_are_set_together_or_both_left_empty():
    pair = CommandPairRule("affected", "project")
    assert not list(pair.problems("", ""))
    assert not list(pair.problems("find", "run"))
    assert list(pair.problems("find", ""))
    assert list(pair.problems(" ", "run"))
