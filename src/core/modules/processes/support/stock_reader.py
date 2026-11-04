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
    count: str = ""
    count_command: str = ""
    step: str = ""


STOCK_READERS = (
    StockReader("pytest", "pytest*,*python -m pytest*,*python3 -m pytest*,*uv run pytest*", "Python tests",
                  r"^FAILED |^ERROR |^E +(assert\b|\w*(Error|Exception)\b)|^(=+ )?([0-9]+ (passed|failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$",
                  r"\[ *([0-9]+)%\]", r"^(=+ )?[0-9]+ passed", r"^(=+ )?([0-9]+ (failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$", r"(?:([0-9]+ failed), )?([0-9]+ passed)",
                  count=r"^collected ([0-9]+) items?|^([0-9]+) tests? collected|\[([0-9]+) items?\]", count_command="{part} --collect-only -q"),
    StockReader("vitest", "*vitest*,npm*run test*,npm test*", "Vitest tests", r"^\s*FAIL |^\s*(Assertion|Type|Reference)?Error\b|^\s*(Test Files|Tests)\s+[0-9]", r"^\s*Test Files\s+(\d+) passed.*\((\d+)\)",
                  r"^\s*(Test Files|Tests)\s+[0-9]", r"^\s*FAIL |^\s*Tests\s+[0-9]+ failed", r"^\s*Tests\s+(?:([0-9]+ failed)\s*\|\s*)?([0-9]+ passed)",
                  count=r"^\S+\.(?:test|spec)\.\w+ > ", count_command='$(printf %s "{part}" | sed "s/ run / list /")'),
    StockReader("dotnet-test", "dotnet test*", ".NET tests", r"Failed |error |Passed!|Failed!|Total tests", "", r"Passed!|Total tests", r"Failed |Failed!|error ",
                  r"(Failed: +[0-9]+, Passed: +[0-9]+)"),
    StockReader("phpunit", "*phpunit*,*pest*,artisan test*", "PHP tests", r"FAILURES!|ERRORS!|Tests: |FAIL |Failed asserting|OK \(", r"\( *([0-9]+)%\)",
                  r"OK \(|Tests: ", r"FAILURES!|ERRORS!|FAIL |Failed asserting|Tests: ",
                  r"(OK \([0-9]+ tests?|Tests: +[0-9]+)"),
    StockReader("npm-build", "npm*run build*,*vite build*", "Building", r"built in|error|Error|ERR!", finished=r"built in", failed=r"error|Error|ERR!", summary=r"built in [^\n]+|error[^\n]*|Error[^\n]*|ERR![^\n]*"),
    StockReader("npm-install", "npm*install*,npm* ci*", "Installing packages", r"added |removed |changed |audited |vulnerabilities|ERR!", finished=r"audited |vulnerabilities", failed=r"ERR!", summary=r"found [0-9]+ vulnerabilities|audited [0-9]+ packages|npm ERR![^\n]*"),
    StockReader("pyright", "*pyright*", "Checking Python types", r"error:|warning:|[0-9]+ errors?, [0-9]+ warnings?", finished=r"[0-9]+ errors?, [0-9]+ warnings?", failed=r"error:", summary=r"[0-9]+ errors?, [0-9]+ warnings?, [0-9]+ informations?"),
    StockReader("tsc", "tsc*,*node_modules/.bin/tsc*,npx tsc*,npx vue-tsc*,vue-tsc*", "Checking TypeScript", r"error TS[0-9]+|Found [0-9]+ errors?", failed=r"error TS[0-9]+", summary=r"error TS[0-9]+:.*|Found [0-9]+ errors?.*"),
    StockReader("eslint", "eslint*,*node_modules/.bin/eslint*,npx eslint*", "Checking JavaScript", r"\berror\b|\bwarning\b|No files matching|Oops!", failed=r"\berror\b|No files matching|Oops!", summary=r"✖ [0-9]+ problems?.*|No files matching.*|Oops!.*"),
    StockReader("pip-install", "pip install*,pip3 install*,*python -m pip install*,*python3 -m pip install*", "Installing Python packages", r"Successfully installed|Requirement already satisfied|ERROR:|error:", finished=r"Successfully installed|Requirement already satisfied", failed=r"ERROR:|error:", summary=r"Successfully installed.*|Requirement already satisfied.*|ERROR:.*|error:.*"),
    StockReader("go-test", "go test*,go -C * test*", "Go tests", r"^(?:ok|FAIL|--- FAIL|panic:|# )", finished=r"^(?:ok|FAIL)\s", failed=r"^(?:FAIL|--- FAIL|panic:|# )", summary=r"^(?:ok|FAIL)\s.*", count=r"^Test\w+$", count_command="{part} -list .", step=r"(?m)^--- (?:(?P<passed>PASS)|(?P<failed>FAIL)): .+"),
)
