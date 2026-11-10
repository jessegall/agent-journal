from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class TemplateTarget:
    """Matches templates for a target, including those with no target restriction."""

    target: str

    def statement(self) -> Statement:
        return Statement("(json_array_length(targets) = 0 OR EXISTS "
                         "(SELECT 1 FROM json_each(targets) WHERE value = ?))", [self.target])
