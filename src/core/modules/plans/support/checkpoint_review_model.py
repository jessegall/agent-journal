
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues
from core.modules.plans.support.plan_settings import REVIEW_MODEL_SETTING, REVIEW_MODELS
from core.modules.plans.support.checkpoint_review_choice import CheckpointReviewChoice

SONNET, EQUAL = REVIEW_MODELS


class CheckpointReviewModel:
    """Chooses the model of a checkpoint review from the setting: Sonnet, on the program that offers it, or the equal
    model of the main agent's own program, which is its general model; never the strongest."""

    def __init__(self, settings: SettingValues, providers: Providers) -> None:
        self.settings, self.providers = settings, providers

    def chosen(self, main_program: str) -> CheckpointReviewChoice:
        if self.settings.text(REVIEW_MODEL_SETTING) == SONNET:
            return CheckpointReviewChoice(self.providers.model_program(SONNET), SONNET)
        provider = self.providers.provider(main_program)
        return CheckpointReviewChoice(main_program, provider.nearest_general_model(provider.model_names()))
