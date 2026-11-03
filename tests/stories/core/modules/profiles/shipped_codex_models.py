from core.modules.profiles.support.shipped_profiles import SHIPPED_PROFILES

MODELS = {profile.name: (profile.model, profile.codex_model) for profile in SHIPPED_PROFILES}


def test_a_medior_runs_on_terra_on_codex_as_on_sonnet_on_claude():
    assert MODELS["journal-medior"] == ("sonnet", "gpt-6.1-terra")


def test_a_senior_runs_on_sol_on_codex_as_on_opus_on_claude():
    assert MODELS["journal-senior"] == ("opus", "gpt-6.1-sol")
