from dataclasses import dataclass


@dataclass(frozen=True)
class ManifestConfig:
    """The config file a plugin keeps in the project and the JSON schema it is checked against, both named relative
    to the project root."""

    file: str
    schema: str
