import pytest

from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.support.cadence_limits import CadenceLimits

CADENCE_SETTINGS = {ProcessSetting.FIRST_OUTPUT_SECONDS: ("first-output-seconds", 30), ProcessSetting.STOPPED_WRITING_SECONDS: ("stopped-writing-seconds", 120),
                    ProcessSetting.SPARSE_SECONDS: ("sparse-seconds", 30)}


@pytest.mark.parametrize("setting", list(CADENCE_SETTINGS))
def test_each_cadence_setting_has_its_key_its_default_and_a_title_and_a_description(setting):
    declared = setting.value
    assert (declared.key, declared.default) == CADENCE_SETTINGS[setting]
    assert declared.title and declared.description


@pytest.mark.parametrize("setting", list(CADENCE_SETTINGS))
@pytest.mark.parametrize("value", [0, -5])
def test_a_value_below_one_is_refused(setting, value):
    assert list(setting.value.rule.problems(setting.value.key, value))


@pytest.mark.parametrize("setting", list(CADENCE_SETTINGS))
def test_one_second_is_accepted(setting):
    assert not list(setting.value.rule.problems(setting.value.key, 1))


def test_the_limits_keep_the_three_seconds():
    limits = CadenceLimits(30, 120, 30)
    assert (limits.first_output_seconds, limits.stopped_writing_seconds, limits.sparse_seconds) == (30, 120, 30)
