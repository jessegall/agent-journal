import re
from collections.abc import Iterator
from dataclasses import dataclass, replace

from core.modules.helpers.support.malformed_agent_options import MalformedAgentOptions
from core.modules.helpers.support.number_rule import NumberRule

ALLOW_NEW = "allow_new"
ALLOW_RESUME = "allow_resume"
ALLOWED_PROFILES = "allowed_profiles"
ALLOWED_PROVIDERS = "allowed_providers"
ALLOWED_MODELS = "allowed_models"
MODEL_DEFAULTS = "model_defaults"
MAX_MINUTES = "max_minutes"
MAX_COST = "max_cost"
OPTION_FIELDS = (ALLOW_NEW, ALLOW_RESUME, ALLOWED_PROFILES, ALLOWED_PROVIDERS, ALLOWED_MODELS, MODEL_DEFAULTS, MAX_MINUTES, MAX_COST)
SWITCHES = {"on": True, "off": False}
PROVIDER_MODEL = re.compile(r"^[\w.-]+:\S+$")
NAME = re.compile(r"^[\w.-]+$")


@dataclass(frozen=True)
class AgentFieldOptions:
    """The options of one agent type, or of one profile of it. A list field that is None inherits; an empty
    list allows nothing."""

    allow_new: bool = True
    allow_resume: bool = True
    allowed_profiles: tuple[str, ...] | None = None
    allowed_providers: tuple[str, ...] | None = None
    allowed_models: tuple[str, ...] | None = None
    model_defaults: tuple[str, ...] | None = None
    max_minutes: int | None = None
    max_cost: float | None = None

    def with_field(self, line: str, field: str, text: str) -> "AgentFieldOptions":
        match field:
            case "allow_new" | "allow_resume":
                return replace(self, **{field: self.switch(line, text)})
            case "allowed_profiles" | "allowed_providers" | "allowed_models" | "model_defaults":
                return replace(self, **{field: self.items(line, field, text)})
            case "max_minutes":
                return replace(self, max_minutes=int(self.number(line, text, NumberRule(0))))
            case "max_cost":
                return replace(self, max_cost=float(self.number(line, text, NumberRule(0, integer=False))))
            case _:
                raise MalformedAgentOptions.line(line, f"{field} is not one of {', '.join(OPTION_FIELDS)}")

    @staticmethod
    def switch(line: str, text: str) -> bool:
        if text not in SWITCHES:
            raise MalformedAgentOptions.line(line, f"expected on or off, not {text!r}")
        return SWITCHES[text]

    @staticmethod
    def items(line: str, field: str, text: str) -> tuple[str, ...]:
        items = tuple(text.split(",")) if text else ()
        pattern = PROVIDER_MODEL if field in (ALLOWED_MODELS, MODEL_DEFAULTS) else NAME
        if any(not pattern.fullmatch(item) for item in items) or len(set(items)) != len(items):
            raise MalformedAgentOptions.line(line, f"{field} takes different items separated by commas, as {'provider:model' if pattern is PROVIDER_MODEL else 'names'}")
        if field == MODEL_DEFAULTS and len({item.split(":", 1)[0] for item in items}) != len(items):
            raise MalformedAgentOptions.line(line, "model_defaults takes one model for each provider")
        return items

    @staticmethod
    def number(line: str, text: str, rule: NumberRule) -> float:
        try:
            number = float(text)
        except ValueError as error:
            raise MalformedAgentOptions.line(line, f"{text!r} is not a number") from error
        for problem in rule.problems("the value", number):
            raise MalformedAgentOptions.line(line, problem)
        return number

    def relation_problems(self) -> Iterator[str]:
        for models in (self.allowed_models, self.model_defaults):
            unlisted = sorted({item.split(":", 1)[0] for item in models or ()} - set(self.allowed_providers or ()))
            if self.allowed_providers is not None and unlisted:
                yield f"models of {', '.join(unlisted)} are listed, but only {', '.join(self.allowed_providers) or 'no provider'} may be used"
        if self.allowed_models is not None and self.model_defaults is not None and not set(self.model_defaults) <= set(self.allowed_models):
            yield "a default model is not among the allowed models"
