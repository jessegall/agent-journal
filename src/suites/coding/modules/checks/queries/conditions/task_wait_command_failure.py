from engine.database.statement import Statement
from engine.query.conditions.text_contains import TextContains
from engine.query.conditions.any_of import AnyOf


class TaskWaitCommandFailure:
    """Matches task checks whose command could not run."""

    def statement(self) -> Statement:
        return AnyOf([TextContains("last_output", "not found"), TextContains("last_output", "syntax error")]).statement()
