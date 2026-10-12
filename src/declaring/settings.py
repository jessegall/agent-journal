from providers import PROVIDERS
from resources.base import ENVIRONMENT
from resources.text import paragraphs


class Setting:
    def __init__(self, name: str, default, title: str, abstract: str = "", unit: str = "", under: str = "",
                 choices: tuple[str, ...] = (), labels: tuple[tuple[str, str], ...] = (), examples: tuple[tuple[str, str], ...] = (), hidden: bool = False,
                 runs_commands: bool = False, scope: str = ENVIRONMENT, secret: bool = False, needs: str = ""):
        self.name, self.default, self.title, self.abstract, self.unit, self.under = name, default, paragraphs(title), paragraphs(abstract), unit, under
        self.choices, self.labels, self.examples, self.hidden, self.runs_commands = choices, dict(labels), dict(examples), hidden, runs_commands
        self.scope, self.secret, self.needs = scope, secret, needs

    def kind(self) -> str:
        if self.secret:
            return "secret"
        if self.choices:
            return "choice"
        if isinstance(self.default, bool):
            return "switch"
        if isinstance(self.default, (int, float)):
            return "number"
        return "map" if isinstance(self.default, dict) else "text"

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title, "abstract": self.abstract, "default": self.default, "unit": self.unit, "kind": self.kind(),
                "under": self.under, "choices": list(self.choices), "labels": self.labels, "examples": self.examples, "hidden": self.hidden,
                "scope": self.scope, "needs": self.needs}

    def allows(self, value) -> bool:
        if self.secret:
            return isinstance(value, str)
        return not self.choices or value in self.choices


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


class Settings(dict):
    def __init__(self, declared: list[Setting], saved: dict):
        saved = {name: value for name, value in saved.items() if all(s.allows(value) for s in declared if s.name == name)}
        merged = {s.name: {**s.default, **saved[s.name]} for s in declared if isinstance(s.default, dict) and isinstance(saved.get(s.name), dict)}
        super().__init__({**{s.name: s.default for s in declared}, **saved, **merged})

    def __getattr__(self, name: str):
        try:
            return self[name]
        except KeyError as error:
            raise AttributeError(f"no setting called {name}") from error
