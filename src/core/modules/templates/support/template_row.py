from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True)
class TemplateRow:
    """The row a template request addresses."""

    row: Model

    @property
    def model(self) -> type[Model]:
        return type(self.row)

    @property
    def cli_name(self) -> str:
        return self.row.cli_name

    @property
    def id(self) -> int:
        return self.row.id

    @property
    def words(self) -> str:
        return f"{self.cli_name} {self.id}"
