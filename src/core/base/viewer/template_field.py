from dataclasses import dataclass


@dataclass(frozen=True)
class TemplateField:
    """A button field that picks a template for a target and purpose."""

    name: str
    label: str
    target: str
    purpose: str
    default_title: str = ""
