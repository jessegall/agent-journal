from dataclasses import dataclass


@dataclass(frozen=True)
class TemplateField:
    """A button field that picks a template for a target and purpose."""

    name: str
    label: str
    target: str
    purpose: str
    default_title: str = ""

    def accepts(self, value: str) -> bool:
        return value.isdigit()

    def problems(self, owner: str, targets: frozenset[str]) -> list[str]:
        return [] if self.target in targets else [f"{owner} targets {self.target}, which is neither a model nor the first word of a command"]
