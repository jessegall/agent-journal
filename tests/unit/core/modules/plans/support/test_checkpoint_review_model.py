from dataclasses import dataclass

from core.modules.codex.providers.codex_provider import CodexProvider
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.plans.support.checkpoint_review_model import CheckpointReviewChoice, CheckpointReviewModel
from core.modules.plans.support.plan_settings import REVIEW_MODEL_SETTING


@dataclass
class SettingsSample:
    chosen: str

    def text(self, key: str) -> str:
        assert key == REVIEW_MODEL_SETTING
        return self.chosen


PROVIDERS = {"claude": ClaudeCodeProvider, "codex": CodexProvider}


class ProvidersSample:
    def provider(self, program: str):
        return PROVIDERS[program].__new__(PROVIDERS[program])

    def model_program(self, model: str) -> str:
        return next(program for program in PROVIDERS if model in self.provider(program).model_names())


def model(chosen: str) -> CheckpointReviewModel:
    return CheckpointReviewModel(SettingsSample(chosen), ProvidersSample())


def test_sonnet_is_sonnet_on_claude_whatever_program_the_main_agent_runs():
    assert model("sonnet").chosen("codex") == CheckpointReviewChoice("claude", "sonnet")


def test_equal_is_the_general_model_of_the_main_agents_own_program_and_never_the_strongest():
    assert model("equal").chosen("claude") == CheckpointReviewChoice("claude", "sonnet")
    assert model("equal").chosen("codex") == CheckpointReviewChoice("codex", "gpt-6.1-terra")
