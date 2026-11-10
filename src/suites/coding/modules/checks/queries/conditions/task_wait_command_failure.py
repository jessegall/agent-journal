from engine.database.statement import Statement


class TaskWaitCommandFailure:
    """Matches task checks whose command could not run."""

    def statement(self) -> Statement:
        return Statement("(instr(last_output, ?) > 0 OR instr(last_output, ?) > 0)", ["not found", "syntax error"])
