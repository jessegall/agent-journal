from engine.registry.setting_tree import SettingTree
from core.modules.plan_reviews.support.plan_review_settings import PLAN_REVIEW_SETTINGS, QUICK_REVIEW_SETTING, REVIEW_MODEL_SETTING, REVIEW_MODELS
from core.modules.plans.support.plan_settings import CHECKPOINT_COMMAND_SETTING, PLAN_SETTINGS

ENTRIES = {entry.key: entry for entry in (*SettingTree().entries("journal.core.plans", PLAN_SETTINGS), *SettingTree().entries("journal.core.plan_reviews", PLAN_REVIEW_SETTINGS))}
KEYS = (QUICK_REVIEW_SETTING, REVIEW_MODEL_SETTING, CHECKPOINT_COMMAND_SETTING)


def test_the_three_checkpoint_settings_are_on_the_work_screen_in_the_checkpoints_section():
    assert [(ENTRIES[key].screen, ENTRIES[key].section) for key in KEYS] == [("work", "Checkpoints")] * 3


def test_the_review_model_needs_the_review_so_it_shows_only_while_the_review_is_on():
    assert ENTRIES[REVIEW_MODEL_SETTING].required_settings == (QUICK_REVIEW_SETTING,)
    assert ENTRIES[REVIEW_MODEL_SETTING].choices == REVIEW_MODELS and ENTRIES[REVIEW_MODEL_SETTING].type == "choice"


def test_the_defaults_are_no_review_the_first_model_and_no_command():
    assert (ENTRIES[QUICK_REVIEW_SETTING].default, ENTRIES[REVIEW_MODEL_SETTING].default, ENTRIES[CHECKPOINT_COMMAND_SETTING].default) == (False, REVIEW_MODELS[0], "")


def test_the_kinds_are_a_switch_a_choice_and_a_text_so_the_generic_screen_draws_them():
    assert [ENTRIES[key].source_component().value for key in KEYS] == ["toggle", "choice", "text"]
