from engine.database.statement import Statement


class Expression:
    """A value a SELECT writes: a column, a constant, a call or a comparison. A view binds no parameters, so an
    expression writes its constants into its text, quoted. Every expression is also a condition."""

    def sql(self) -> str:
        raise NotImplementedError

    def statement(self) -> Statement:
        return Statement(self.sql())
