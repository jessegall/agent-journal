from core.base.database.migration import Migration


class ReaderStepsAndTitlesMigration(Migration):
    """A reader says what it selects and how a run's steps look; an output keeps the title and the step counts
    worked out for it, so a read never works them out again."""

    number = 8
    statements = tuple(["ALTER TABLE readers ADD COLUMN subject TEXT NOT NULL DEFAULT ''",
                        "ALTER TABLE readers ADD COLUMN step_pattern TEXT NOT NULL DEFAULT ''",
                        "ALTER TABLE outputs ADD COLUMN title TEXT NOT NULL DEFAULT ''",
                        "ALTER TABLE outputs ADD COLUMN steps_passed INTEGER NOT NULL DEFAULT 0",
                        "ALTER TABLE outputs ADD COLUMN steps_failed INTEGER NOT NULL DEFAULT 0",
                        "UPDATE readers SET subject = 'the failed tests of a pytest run with their assertion lines, its summary, or the error that stopped it', step_pattern = '[.FEsxX]' WHERE name = 'pytest'",
                        "UPDATE readers SET subject = 'the failed tests of a vitest run with their assertion lines, and its totals' WHERE name = 'vitest'",
                        "UPDATE readers SET subject = 'the failed tests and the totals of a dotnet test run' WHERE name = 'dotnet-test'",
                        "UPDATE readers SET subject = 'the failures and the totals of a phpunit or pest run', step_pattern = '[.FEWRSI]' WHERE name = 'phpunit'"])
