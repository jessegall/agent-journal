from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES


SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)

MODELS = {profile.name: (profile.model, profile.codex_model) for profile in SHIPPED_PROFILES}


def test_a_medior_runs_on_terra_on_codex_as_on_sonnet_on_claude():
    expect_journal_medior_models(MODELS, ("sonnet", "gpt-6.1-terra"))


def test_a_senior_runs_on_sol_on_codex_as_on_opus_on_claude():
    expect_journal_senior_models(MODELS, ("opus", "gpt-6.1-sol"))


def expect_journal_senior_models(item, expected) -> None:
    actual = item['journal-senior']
    assert actual == expected, actual


def expect_journal_medior_models(item, expected) -> None:
    actual = item['journal-medior']
    assert actual == expected, actual
