from core.modules.helpers.support.model_choice import ModelChoice


def test_default_and_no_model_mean_the_profile_s_own_and_an_exact_model_is_kept():
    assert (ModelChoice.chosen("default"), ModelChoice.chosen(None), ModelChoice.chosen("sonnet")) == ("", "", "sonnet")
