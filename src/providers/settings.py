from declaring.settings import Setting
from providers import PROVIDERS
from resources.base import ENVIRONMENT


class ModelsSetting(Setting):
    """A model for each provider, picked from the models that provider offers."""

    def __init__(self, name: str, title: str, abstract: str = "", scope: str = ENVIRONMENT):
        super().__init__(name, {provider: kind.dispatch_default for provider, kind in PROVIDERS.items()}, title, abstract, scope=scope)

    def kind(self) -> str:
        return "models"

    def describe(self) -> dict:
        labels = {provider: kind().model_labels() for provider, kind in PROVIDERS.items()}
        return {**super().describe(), "choices": {provider: list(named) for provider, named in labels.items()}, "labels": labels}

    def allows(self, value) -> bool:
        return isinstance(value, dict) and all(provider in PROVIDERS and PROVIDERS[provider]().offers(model) for provider, model in value.items())
