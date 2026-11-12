from engine.registry.setting_tree import SettingTree
from core.modules.plans.support.plan_settings import CHECKPOINT_COMMAND_SETTING, PLAN_SETTINGS, QUICK_REVIEW_SETTING, REVIEW_MODEL_SETTING, REVIEW_MODELS, WAIT_FOR_PERSON_SETTING

ENTRIES = {entry.key: entry for entry in SettingTree().entries("journal.core.plans", PLAN_SETTINGS)}
KEYS = (QUICK_REVIEW_SETTING, REVIEW_MODEL_SETTING, CHECKPOINT_COMMAND_SETTING, WAIT_FOR_PERSON_SETTING)


def test_the_four_checkpoint_settings_are_on_the_work_screen_in_the_checkpoints_section():
    assert [(ENTRIES[key].screen, ENTRIES[key].section) for key in KEYS] == [("work", "Checkpoints")] * 4


def test_the_review_model_needs_the_review_so_it_shows_only_while_the_review_is_on():
    assert ENTRIES[REVIEW_MODEL_SETTING].required_settings == (QUICK_REVIEW_SETTING,)
    assert ENTRIES[REVIEW_MODEL_SETTING].choices == REVIEW_MODELS and ENTRIES[REVIEW_MODEL_SETTING].type == "choice"


def test_the_defaults_are_no_review_the_first_model_no_command_and_no_waiting():
    assert (ENTRIES[QUICK_REVIEW_SETTING].default, ENTRIES[REVIEW_MODEL_SETTING].default, ENTRIES[CHECKPOINT_COMMAND_SETTING].default, ENTRIES[WAIT_FOR_PERSON_SETTING].default) == (False, REVIEW_MODELS[0], "", False)


def test_waiting_for_the_person_is_set_by_a_person_and_says_what_it_does_in_its_description():
    entry = ENTRIES[WAIT_FOR_PERSON_SETTING]
    assert entry.person_set is True and "plan card" in entry.description and "stops" in entry.description


def test_the_kinds_are_a_switch_a_choice_a_text_and_a_switch_so_the_generic_screen_draws_them():
    assert [ENTRIES[key].drawn_by().value for key in KEYS] == ["toggle", "choice", "text", "toggle"]
