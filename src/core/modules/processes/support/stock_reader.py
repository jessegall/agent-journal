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
                  r"(Failed: +[0-9]+, Passed: +[0-9]+)", count=r"Total: +([0-9]+)", step=r"(?m)^\s*(?:(?P<passed>Passed) \S|(?P<failed>Failed) \S)"),
    StockReader("phpunit", "*phpunit*,*pest*,artisan test*", "PHP tests", r"FAILURES!|ERRORS!|Tests: |FAIL |Failed asserting|OK \(", r"\( *([0-9]+)%\)",
                  r"OK \(|Tests: ", r"FAILURES!|ERRORS!|FAIL |Failed asserting|Tests: ",
                  r"(OK \([0-9]+ tests?|Tests: +[0-9]+)", count=r"OK \(([0-9]+) tests?|^Tests: +([0-9]+)"),
    StockReader("npm-build", "npm*run build*,*vite build*", "Building", r"built in|error|Error|ERR!", finished=r"built in", failed=r"error|Error|ERR!", summary=r"built in [^\n]+|error[^\n]*|Error[^\n]*|ERR![^\n]*"),
    StockReader("npm-install", "npm*install*,npm* ci*,npm i,npm i *", "Installing packages", r"added |removed |changed |audited |vulnerabilities|ERR!", finished=r"audited |vulnerabilities", failed=r"ERR!", summary=r"found [0-9]+ vulnerabilities|audited [0-9]+ packages|npm ERR![^\n]*"),
    StockReader("pyright", "*pyright*", "Checking Python types", r"error:|warning:|[0-9]+ errors?, [0-9]+ warnings?", finished=r"[0-9]+ errors?, [0-9]+ warnings?", failed=r"error:", summary=r"[0-9]+ errors?, [0-9]+ warnings?, [0-9]+ informations?"),
    StockReader("tsc", "tsc*,*node_modules/.bin/tsc*,npx tsc*,npx vue-tsc*,vue-tsc*", "Checking TypeScript", r"error TS[0-9]+|Found [0-9]+ errors?", failed=r"error TS[0-9]+", summary=r"error TS[0-9]+:.*|Found [0-9]+ errors?.*"),
    StockReader("eslint", "eslint*,*node_modules/.bin/eslint*,npx eslint*", "Checking JavaScript", r"\berror\b|\bwarning\b|No files matching|Oops!", failed=r"\berror\b|No files matching|Oops!", summary=r"✖ [0-9]+ problems?.*|No files matching.*|Oops!.*"),
    StockReader("pip-install", "pip install*,pip3 install*,*python -m pip install*,*python3 -m pip install*", "Installing Python packages", r"Successfully installed|Requirement already satisfied|ERROR:|error:", finished=r"Successfully installed|Requirement already satisfied", failed=r"ERROR:|error:", summary=r"Successfully installed.*|Requirement already satisfied.*|ERROR:.*|error:.*"),
    StockReader("cargo-build", "cargo build*,cargo check*,cargo clippy*", "Building Rust", r"^\s*(?:Compiling|Checking|Finished|error|warning)", finished=r"^\s*Finished", failed=r"^error", summary=r"^\s*Finished.*|^error:.*"),
    StockReader("cargo-test", "cargo test*", "Rust tests", r"^test .* FAILED|^test result:|^error:", finished=r"^test result:", failed=r"^test .* FAILED|^test result: FAILED|^error:", summary=r"^test result:.*|^error:.*", count=r"^running ([0-9]+) tests?", step=r"(?m)^test .+ \.\.\. (?:(?P<passed>ok)|(?P<failed>FAILED))$"),
    StockReader("cargo-nextest", "cargo nextest run*", "Rust tests", r"^\s*(?:FAIL|Summary|error:)", finished=r"^\s*Summary", failed=r"^\s*(?:FAIL|error:)", summary=r"Summary\s+\[[^]]+\]\s+([0-9]+ tests? run:.*)|^error:.*", count=r"^\s*Starting ([0-9]+) tests?", step=r"(?m)^[ \t]*(?:(?P<passed>PASS)|(?P<failed>FAIL))[ \t]+\["),
    StockReader("docker-build", "docker build *,docker buildx build *", "Building image", r"^#\d+ .*(?:DONE|ERROR)|^ERROR:|^error:|Successfully built|Successfully tagged", progress=r"\[([0-9]+)/([0-9]+)\]", finished=r"^#\d+ .*DONE|Successfully built|Successfully tagged", failed=r"^#\d+ .*ERROR|^ERROR:|^error:", summary=r"^#\d+ .*DONE.*|^ERROR:.*|^error:.*|Successfully (?:built|tagged).*"),
    StockReader("jest", "jest*,npx*jest*,*node_modules/.bin/jest*", "Jest tests", r"^\s*(?:FAIL |PASS |Test Suites:|Tests:|Error:)", r"Test Suites:.*?(\d+) passed,\s*(\d+) total", r"^Test Suites:", r"^\s*(?:FAIL |Error:)", r"^Tests:.*|^Error:.*", count=r"^Tests:.*?([0-9]+) total"),
    StockReader("go-test", "go test*,go -C * test*", "Go tests", r"^(?:ok|FAIL|--- FAIL|panic:|# )", finished=r"^(?:ok|FAIL)\s", failed=r"^(?:FAIL|--- FAIL|panic:|# )", summary=r"^(?:ok|FAIL)\s.*", count=r"^Test\w+$", count_command="{part} -list .", step=r"(?m)^--- (?:(?P<passed>PASS)|(?P<failed>FAIL)): .+"),
    StockReader("go-build", "go build*,go -C * build*,go install*,go -C * install*", "Building Go", r"^# |\.go:[0-9]+:[0-9]+:|^go: ", failed=r"^# |\.go:[0-9]+:[0-9]+:|^go: ", summary=r"\.go:[0-9]+:[0-9]+:.*|^go: .*|^# .*"),
    StockReader("go-vet", "go vet*,go -C * vet*", "Checking Go", r"^# |\.go:[0-9]+:[0-9]+:|^go: ", failed=r"^# |\.go:[0-9]+:[0-9]+:|^go: ", summary=r"\.go:[0-9]+:[0-9]+:.*|^go: .*|^# .*"),
    StockReader("make", "make,make *,gmake,gmake *", "Building", r"\*\*\*|\berror\b", failed=r"\*\*\*", summary=r"^make.*\*\*\*.*|^.+$"),
    StockReader("gcc", "gcc *,g++ *,clang *,clang++ *,cc *", "Compiling C", r"\berror:|\bwarning:|errors? generated", failed=r"\berror:", summary=r"[0-9]+ errors? generated\.|.*\berror:.*|^.+$"),
    StockReader("cmake", "cmake *", "Building with CMake", r"CMake Error|Build files have been written|Built target|\berror:", finished=r"Build files have been written|Built target", failed=r"CMake Error|\berror:", summary=r"-- Build files have been written.*|CMake Error.*|\[100%\] Built target.*"),
    StockReader("ruby-minitest", "ruby *test*,rake test*,*bundle exec rake test*,rails test*", "Ruby tests", r"^\s*(?:Failure|Error):|[0-9]+ runs, [0-9]+ assertions", finished=r"[0-9]+ runs, ", failed=r"[1-9][0-9]* (?:failures|errors)", summary=r"[0-9]+ runs, .*", count=r"^([0-9]+) runs,", step=r"(?m)^[.FES]+$"),
    StockReader("rspec", "rspec*,*bundle exec rspec*", "Ruby tests", r"^rspec \./|[0-9]+ examples?, [0-9]+ failures?|^Failures:", finished=r"[0-9]+ examples?, ", failed=r"[1-9][0-9]* failures?|^rspec ", summary=r"[0-9]+ examples?, [0-9]+ failures?.*", count=r"^([0-9]+) examples?,", step=r"(?m)^[.F*]+$"),
    StockReader("mix-test", "mix test*", "Elixir tests", r"^\s+[0-9]+\) test|[0-9]+ tests?, [0-9]+ failures?", finished=r"[0-9]+ tests?, ", failed=r"[1-9][0-9]* failures?", summary=r"[0-9]+ tests?, [0-9]+ failures?.*", count=r"^([0-9]+) tests?,", step=r"(?m)^[.F*]+$"),
    StockReader("bun-test", "bun test*", "Bun tests", r"^\(fail\)|^\s*[0-9]+ (?:pass|fail)\b|^Ran [0-9]+ tests?", finished=r"^Ran [0-9]+ tests?", failed=r"^\(fail\)|^\s*[1-9][0-9]* fail", summary=r"^Ran [0-9]+ tests?.*", count=r"^Ran ([0-9]+) tests?", step=r"(?m)^(?:(?P<passed>\(pass\))|(?P<failed>\(fail\))) "),
    StockReader("swift-test", "swift test*", "Swift tests", r"error:|Test Suite '.*' (?:passed|failed)|Executed [0-9]+ tests?", progress=r"\[([0-9]+)/([0-9]+)\]", finished=r"Executed [0-9]+ tests?", failed=r"error:|with [1-9][0-9]* failures?", summary=r"Executed [0-9]+ tests?.*|^error:.*", count=r"Executed ([0-9]+) tests?", step=r"(?m)^Test Case '.*' (?:(?P<passed>passed)|(?P<failed>failed))"),
    StockReader("swift-build", "swift build*", "Building Swift", r"error:|warning:|Build complete", progress=r"\[([0-9]+)/([0-9]+)\]", finished=r"Build complete", failed=r"error:", summary=r"Build complete.*|^.*error: .*"),
    StockReader("dotnet-build", "dotnet build*,dotnet publish*,msbuild*", "Building .NET", r"error [A-Z]+[0-9]+|Build succeeded|Build FAILED|[0-9]+ Error\(s\)", finished=r"Build succeeded", failed=r"error [A-Z]+[0-9]+|Build FAILED", summary=r"Build succeeded\.|Build FAILED\.|[0-9]+ Error\(s\)"),
    StockReader("maven", "mvn *,./mvnw *,mvnw *", "Building Java", r"\[ERROR\]|BUILD SUCCESS|BUILD FAILURE|Tests run:", finished=r"BUILD SUCCESS", failed=r"BUILD FAILURE|\[ERROR\]", summary=r"BUILD (?:SUCCESS|FAILURE)|Tests run: [0-9]+.*"),
    StockReader("gradle", "gradle *,./gradlew *,gradlew *", "Building with Gradle", r"BUILD SUCCESSFUL|BUILD FAILED|^FAILURE:|> Task .* FAILED", finished=r"BUILD SUCCESSFUL", failed=r"BUILD FAILED|^FAILURE:", summary=r"BUILD (?:SUCCESSFUL|FAILED).*"),
    StockReader("webpack", "webpack*,npx webpack*,*node_modules/.bin/webpack*", "Building with webpack", r"compiled (?:successfully|with)|ERROR in|Module not found", finished=r"compiled successfully", failed=r"ERROR in|Module not found", summary=r"compiled .*|ERROR in .*"),
    StockReader("php-lint", "php -l *", "Checking PHP", r"No syntax errors|Parse error|Errors parsing", finished=r"No syntax errors", failed=r"Parse error|Errors parsing", summary=r"No syntax errors.*|.*Parse error:.*"),
    StockReader("mypy", "mypy *,*python -m mypy*,*python3 -m mypy*", "Checking Python types", r"error:|Success: no issues|Found [0-9]+ errors?", finished=r"Success: no issues", failed=r"error:", summary=r"Success: no issues.*|Found [0-9]+ errors?.*"),
    StockReader("ruff", "ruff *,*python -m ruff*,*python3 -m ruff*", "Checking Python", r"^\S+:[0-9]+:[0-9]+: |All checks passed|Found [0-9]+ errors?", finished=r"All checks passed", failed=r"^\S+:[0-9]+:[0-9]+: |Found [0-9]+ errors?", summary=r"All checks passed!|Found [0-9]+ errors?.*"),
)
