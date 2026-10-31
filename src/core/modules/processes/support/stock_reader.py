from dataclasses import dataclass


@dataclass(frozen=True)
class StockReader:
    """A reader the processes module ships: what it reads, and the patterns that pick its lines, progress,
    finish, failure and summary."""

    name: str
    commands: str
    title: str
    lines: str
    progress: str = ""
    finished: str = ""
    failed: str = ""
    summary: str = ""


STOCK_READERS = (
    StockReader("pytest", "pytest*,*python -m pytest*,*uv run pytest*", "Running tests",
                  r"^FAILED |^ERROR |^E +(assert\b|\w*(Error|Exception)\b)|^(=+ )?([0-9]+ (passed|failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$",
                  r"\[ *([0-9]+)%\]", r"^(=+ )?[0-9]+ passed", r"^(=+ )?([0-9]+ (failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$", r"(?:([0-9]+ failed), )?([0-9]+ passed)"),
    StockReader("vitest", "*vitest*", "Running tests", r"^\s*FAIL |^\s*(Assertion|Type|Reference)?Error\b|^\s*(Test Files|Tests)\s+[0-9]", "",
                  r"^\s*(Test Files|Tests)\s+[0-9]", r"^\s*FAIL |^\s*Tests\s+[0-9]+ failed", r"^\s*Tests\s+(?:([0-9]+ failed)\s*\|\s*)?([0-9]+ passed)"),
    StockReader("dotnet-test", "dotnet test*", "Running tests", r"Failed |error |Passed!|Failed!|Total tests", "", r"Passed!|Total tests", r"Failed |Failed!|error "),
    StockReader("phpunit", "*phpunit*,*pest*,artisan test*", "Running tests", r"FAILURES!|ERRORS!|Tests: |FAIL |Failed asserting|OK \(", r"\( *([0-9]+)%\)",
                  r"OK \(|Tests: ", r"FAILURES!|ERRORS!|FAIL |Failed asserting|Tests: "),
)
