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


DART_LINES = r"^[0-9]+:[0-9]+ \+[0-9]+"
DART_SUMMARY = r"^[0-9]+:[0-9]+ \+[0-9]+.*: (?:All tests passed!|Some tests failed\.)"
DART_FAILED = r"\[E\]$|: Some tests failed\."
DART_COUNT = r"^[0-9]+:[0-9]+ \+([0-9]+)(?: [~-][0-9]+)*: (?:All tests passed!|Some tests failed\.)"
DART_STEP = r"(?m)^[0-9]+:[0-9]+ \+[0-9]+(?: ~[0-9]+)?(?: -[0-9]+)?: (?:(?P<failed>.*\[E\]$)|(?P<passed>(?!All tests passed|Some tests failed|loading ).*))"

GOLANG_TEST_LISTING = '''go_test_list() {
    pattern=.
    previous=
    for argument do
        case "$previous" in -run|-test.run) pattern=$argument ;; esac
        case "$argument" in -run=*|-test.run=*) pattern=${argument#*=} ;; esac
        previous=$argument
    done
    "$@" -list "$pattern"
}
go_test_list {part}'''

STOCK_READERS = (
    StockReader("pytest", "pytest*,*python -m pytest*,*python3 -m pytest*,*uv run pytest*", "Python tests",
                  r"^FAILED |^ERROR |^E +(assert\b|\w*(Error|Exception)\b)|^(=+ )?([0-9]+ (passed|failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$|^\+{3,} Timeout \+{3,}$|^[0-9]+(/[0-9]+)? tests? collected",
                  "", r"^(=+ )?[0-9]+ passed", r"^(=+ )?([0-9]+ (failed|errors?|deselected)\b|no tests ran)|^ERROR: .{1,70}$", r"(?:[0-9]+ failed, )?[0-9]+ passed|[0-9]+ failed|[0-9]+ errors? in |^\+{3,} Timeout \+{3,}$|^Timeout \([0-9:.]+\)!",
                  count=r"^collected [0-9]+ items? / [0-9]+ deselected / ([0-9]+) selected|^([0-9]+)/[0-9]+ tests? collected|^collected ([0-9]+) items?|^([0-9]+) tests? collected|\[([0-9]+) items?\]|^.+\.py: (?P<sum>[0-9]+)$", count_command="{part} --collect-only -q", step=r"[.FEsxX]"),
    StockReader("vitest", "*vitest*,npm*run test*,npm test*", "Vitest tests", r"^\s*FAIL |^\s*(Assertion|Type|Reference)?Error\b|^\s*(Test Files|Tests)\s+[0-9]", "",
                  r"^\s*(Test Files|Tests)\s+[0-9]", r"^\s*FAIL |^\s*Tests\s+[0-9]+ failed", r"^\s*Tests\s+(?:([0-9]+ failed)\s*\|\s*)?([0-9]+ passed)",
                  count=r"^([0-9]+)$|^\s*Tests\s+.*\(([0-9]+)\)\s*$", count_command='eval "$(printf %s "{part}" | sed -e "s/ run / list /" -e "s/ --reporter[= ][^ ]*//g")" | grep -c " > "', step=r"(?m)^[ \t]*(?:(?P<passed>✓)|(?P<failed>×))[ \t]+[^\n]*?(?:\((?P<count>[0-9]+) tests?\)[^\n]*)?[ \t]*$"),
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
    StockReader("go-test", "go test*,go -C * test*", "Go tests", r"^(?:ok|FAIL|--- FAIL|panic:|# )", finished=r"^(?:ok|FAIL)\s", failed=r"^(?:FAIL|--- FAIL|panic:|# )", summary=r"^(?:ok|FAIL)\s.*", count=r"^Test\w+$", count_command=GOLANG_TEST_LISTING, step=r"(?m)^--- (?:(?P<passed>PASS)|(?P<failed>FAIL)): .+"),
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
    StockReader("prove", "prove*", "Perl tests", r"^\S+ \.\. |^# +Failed test|^Dubious|^Failed [0-9]+/|^Test Summary Report|^Files=|^Result: |^All tests successful", finished=r"^Result: ", failed=r"^Result: FAIL|^Dubious|^Failed [0-9]+/",
                  summary=r"^Files=[0-9]+, Tests=[0-9]+", count=r"^Files=([0-9]+)", step=r"(?m)^(?:\S+ \.\. (?P<passed>ok)|(?P<failed>Dubious, test returned.*))$"),
    StockReader("zig-test", "zig test*,zig build test*", "Zig tests", r"^[0-9]+/[0-9]+ .*\.\.\.(?:OK|FAIL|SKIP)|^All [0-9]+ tests? passed|^[0-9]+ passed; |^error: ", r"^([0-9]+)/([0-9]+) .*\.\.\.", r"^All [0-9]+ tests? passed|^[0-9]+ passed; ", r"\.\.\.FAIL|[1-9][0-9]* failed;|^error: ",
                  r"^All [0-9]+ tests? passed\.|^[0-9]+ passed; .*", count=r"^[0-9]+/([0-9]+) .*\.\.\.", step=r"(?m)^[0-9]+/[0-9]+ .*\.\.\.(?:(?P<passed>OK)|(?P<failed>FAIL))"),
    StockReader("crystal-spec", "crystal spec*", "Crystal tests", r"^[.FE*]+$|^Failures:|^Finished in |^[0-9]+ examples?, |^Failed examples:|^crystal spec ", finished=r"^[0-9]+ examples?, ", failed=r"^Failures:|[1-9][0-9]* (?:failures|errors)",
                  summary=r"^[0-9]+ examples?, .*", count=r"^([0-9]+) examples?,", step=r"(?m)^[.FE*]+$"),
    StockReader("ginkgo", "ginkgo*", "Ginkgo tests", r"^Running Suite|^Will run |^Ran [0-9]+ of |^(?:SUCCESS|FAIL)! |^FAIL$|^Test Suite (?:Passed|Failed)|^--- FAIL", finished=r"^Test Suite (?:Passed|Failed)", failed=r"^FAIL$|^--- FAIL|^FAIL! |^Test Suite Failed",
                  summary=r"^(?:SUCCESS|FAIL)! -- .*", count=r"^Will run ([0-9]+) of", step=r"(?m)(?P<passed>•)|(?P<failed>^FAIL$)"),
    StockReader("meson-test", "meson test*", "Meson tests", r"^\s*[0-9]+/[0-9]+ \S+\s+(?:OK|FAIL|TIMEOUT|SKIP)|^(?:Ok|Fail|Timeout|Skipped):", r"^\s*([0-9]+)/([0-9]+) \S+\s+(?:OK|FAIL|TIMEOUT|SKIP)", r"^Ok: +[0-9]+", r"^Fail: +[1-9]|^\s*[0-9]+/[0-9]+ \S+\s+(?:FAIL|TIMEOUT)\b",
                  r"^(?:Ok|Fail): +[0-9]+.*", count=r"^\s*[0-9]+/([0-9]+) \S+\s+(?:OK|FAIL|TIMEOUT|SKIP)", step=r"(?m)^\s*[0-9]+/[0-9]+ \S+\s+(?:(?P<passed>OK)|(?P<failed>FAIL|TIMEOUT))\b"),
    StockReader("deno-test", "deno test*", "Deno tests", r"^running [0-9]+ tests? from|\.\.\. (?:ok|FAILED|ignored)|^(?:ok|FAILED) \| |^test result: |^failures:|^error: ", finished=r"^(?:ok|FAILED) \| |^test result: ",
                  failed=r" \.\.\. FAILED|^FAILED \| |^test result: FAILED|^failures:", summary=r"^(?:ok|FAILED) \| .*|^test result: .*", count=r"^running ([0-9]+) tests? from", step=r"(?m) \.\.\. (?:(?P<passed>ok)|(?P<failed>FAILED))\b"),
    StockReader("dart-test", "dart test*", "Dart tests", DART_LINES, finished=DART_SUMMARY, failed=DART_FAILED, summary=DART_SUMMARY, count=DART_COUNT, step=DART_STEP),
    StockReader("flutter-test", "flutter test*", "Flutter tests", DART_LINES, finished=DART_SUMMARY, failed=DART_FAILED, summary=DART_SUMMARY, count=DART_COUNT, step=DART_STEP),
    StockReader("dune-test", "dune test*,dune runtest*,dune build @runtest*", "OCaml tests", r"^\s*\[(?:OK|FAIL)\]|^Test Successful|^FAILED [0-9]+ / [0-9]+ tests|^File \"", finished=r"^Test Successful", failed=r"^FAILED [0-9]+ / [0-9]+ tests|^\s*\[FAIL\]",
                  summary=r"^Test Successful.*|^FAILED [0-9]+ / [0-9]+ tests", count=r"([0-9]+) tests? run\.|^FAILED [0-9]+ / ([0-9]+) tests", step=r"(?m)^\s*\[(?:(?P<passed>OK)|(?P<failed>FAIL))\]"),
    StockReader("cabal-test", "cabal test*,cabal v2-test*,cabal new-test*", "Haskell tests", r"^Test suite \S+: |^[0-9]+ of [0-9]+ test suites|^Running [0-9]+ test suites|^Error: |: error:", finished=r"^[0-9]+ of [0-9]+ test suites", failed=r"^Test suite \S+: FAIL|^Error: |: error:",
                  summary=r"^[0-9]+ of [0-9]+ test suites.*", count=r"^Running ([0-9]+) test suites", step=r"(?m)^Test suite \S+: (?:(?P<passed>PASS)|(?P<failed>FAIL))\b"),
    StockReader("scala-cli-test", "scala-cli test*", "Scala tests", r"^\s*[+-] \S.*(?:[0-9]s|milliseconds?\))$|^==> X |^Total number of tests run: |^Tests: succeeded|^All tests passed", finished=r"^All tests passed|^Tests: succeeded", failed=r"^==> X |^Tests: succeeded [0-9]+, failed [1-9]",
                  summary=r"^All tests passed\.|^Tests: succeeded.*|^\s*\+ \S.*|^==> X .*", count=r"^\s*(?:[+-] \S.*(?:[0-9]s|milliseconds?\))$|==> X )", step=r"(?m)^\s*(?:(?P<passed>[+-]) \S.*(?:[0-9]s|milliseconds?\))$|(?P<failed>==> X) )"),
    StockReader("sbt-test", "sbt test*,sbt testOnly*", "Scala tests", r"^\s*\+ \S|^==> X |^\[info\] (?:Passed|Failed)|^\[error\] (?:Failed|\()|^\[success\]", finished=r"^\[success\]|^\[info\] Passed: Total", failed=r"^\[error\] (?:Failed|\()|^==> X ",
                  summary=r"^\[(?:info|error)\] (?:Passed|Failed): Total .*", count=r"^\[(?:info|error)\] (?:Passed|Failed): Total ([0-9]+)", step=r"(?m)^\s*(?:(?P<passed>\+) \S|(?P<failed>==> X) )"),
    StockReader("ng-test", "ng test*,npx ng test*", "Angular tests", r"Executed [0-9]+ of [0-9]+|\bFAILED\b|^TOTAL: ", r"Executed ([0-9]+) of ([0-9]+)", r"^TOTAL: ", r"\bFAILED\b", r"(Executed [0-9]+ of [0-9]+(?: \([0-9]+ FAILED\))?)|(^TOTAL: .*)", count=r"Executed [0-9]+ of ([0-9]+)"),
    StockReader("pio-test", "pio test*,platformio test*", "PlatformIO tests", r"\[(?:PASSED|FAILED)\]|test cases:|^Collected [0-9]+ tests|^Processing ", finished=r"test cases: ", failed=r"\[FAILED\]|test cases: .*[1-9][0-9]* failed",
                  summary=r"[0-9]+ test cases: [0-9]+ [a-z]+(?:, [0-9]+ [a-z]+)*(?: in [0-9:.]+)?", count=r"^=+ ([0-9]+) test cases:", step=r"(?m)^\S+:[0-9]+: \S+\s+\[(?:(?P<passed>PASSED)|(?P<failed>FAILED))\]"),
    StockReader("hatch-test", "hatch test*,hatch run test*", "Python tests", r"^FAILED |^ERROR |^E +(assert\b|\w*(Error|Exception)\b)|^(=+ )?([0-9]+ (passed|failed|errors?|deselected)\b|no tests ran)", r"\[ *([0-9]+)%\]", r"^(=+ )?[0-9]+ passed",
                  r"^(=+ )?([0-9]+ (failed|errors?|deselected)\b|no tests ran)", r"(?:([0-9]+ failed), )?([0-9]+ passed)", count=r"^collected ([0-9]+) items?"),
    StockReader("tox", "tox*", "Python tests", r"^\s*\S+: (?:OK|FAIL|exit [0-9]+)|^\s*\S+: commands\[[0-9]+\]>|^congratulations|^\s*evaluation failed", finished=r"^congratulations", failed=r"^\s*evaluation failed|^\s*\S+: FAIL code",
                  summary=r"^congratulations :\)|^\s*evaluation failed :\(.*", count=r"^\s*\S+: commands\[0\]>", step=r"(?m)^\s*\S+: (?:(?P<passed>OK) \S+ in|(?P<failed>FAIL) code)"),
    StockReader("nox", "nox*", "Python tests", r"^nox > (?:Running session|Session)", finished=r"^nox > Session \S+ was successful", failed=r"^nox > Session \S+ failed", summary=r"^nox > Session .*", count=r"^nox > Running session ",
                  step=r"(?m)^nox > Session \S+ (?:(?P<passed>was successful)|(?P<failed>failed))"),
    StockReader("dbt-test", "dbt test*", "dbt tests", r"[0-9]+ of [0-9]+ (?:OK|PASS|WARN|ERROR|FAIL|SKIP)\b|^Done\.|^Completed |^Finished running|Database Error", r"\b([0-9]+) of ([0-9]+) (?:OK|PASS|WARN|ERROR|FAIL|SKIP)\b", r"^Done\. |^Completed successfully",
                  r"^Completed with [0-9]+ errors?|^Done\. .*ERROR=[1-9]|[0-9]+ of [0-9]+ (?:ERROR|FAIL) ", r"Done\. .*", count=r"\b[0-9]+ of ([0-9]+) (?:START|OK|PASS|WARN|ERROR|FAIL|SKIP)\b|TOTAL=([0-9]+)",
                  step=r"(?m)\b[0-9]+ of [0-9]+ (?:(?P<passed>OK|PASS)|(?P<failed>ERROR|FAIL)) "),
    StockReader("dbt", "dbt run*,dbt build*,dbt seed*,dbt snapshot*", "Running dbt models", r"[0-9]+ of [0-9]+ (?:OK|PASS|WARN|ERROR|FAIL|SKIP)\b|^Done\.|^Completed |^Finished running|Database Error", r"\b([0-9]+) of ([0-9]+) (?:OK|PASS|WARN|ERROR|FAIL|SKIP)\b",
                  r"^Done\. |^Completed successfully", r"^Completed with [0-9]+ errors?|^Done\. .*ERROR=[1-9]|[0-9]+ of [0-9]+ (?:ERROR|FAIL) ", r"Done\. .*"),
    StockReader("cabal-build", "cabal build*,cabal v2-build*,cabal new-build*,cabal install*,cabal v2-install*", "Building Haskell", r"^\[[0-9]+ of [0-9]+\] Compiling|^(?:Building|Linking|Configuring|Preprocessing) |: error:|^Error: |^Failed to build", r"^\[([0-9]+) of ([0-9]+)\] Compiling", r"^Linking ", r": error:|^Error: |^Failed to build",
                  r"^Linking .*|: error:.*|^Error: .*|^Failed to build .*"),
    StockReader("stack-build", "stack build*", "Building Haskell", r"^\S+> (?:configure|build|copy/register)|^\[[0-9]+ of [0-9]+\] |: error:|^Error: ", r"^\[([0-9]+) of ([0-9]+)\] ", r"^\S+> copy/register|^Registering library", r": error:$|^Error: \[S-[0-9]+\]|Process exited with code: ExitFailure",
                  r"^Error: \[S-[0-9]+\]|^\S+> copy/register"),
    StockReader("sbt-build", "sbt compile*,sbt package*", "Building Scala", r"^\[(?:success|error|warn)\] |compiling [0-9]+ Scala sources?", finished=r"^\[success\]", failed=r"^\[error\]", summary=r"^\[success\] .*|^\[error\] .*"),
    StockReader("ng-build", "ng build*,npx ng build*", "Building Angular", r"Application bundle generation (?:complete|failed)|\[ERROR\]|^Output location:", finished=r"generation complete", failed=r"generation failed|\[ERROR\]",
                  summary=r"Application bundle generation (?:complete|failed)\..*|✘ \[ERROR\].*"),
    StockReader("hatch-build", "hatch build*", "Building Python package", r"^\[(?:sdist|wheel)\]|^dist/", finished=r"^dist/", summary=r"^dist/.*"),
    StockReader("buck2-build", "buck2 build*", "Building with Buck2", r"^BUILD (?:SUCCEEDED|FAILED)|^Failed to build", finished=r"^BUILD SUCCEEDED", failed=r"^BUILD FAILED|^Failed to build", summary=r"^BUILD (?:SUCCEEDED|FAILED)|^Failed to build.*"),
    StockReader("pants-package", "pants package*", "Packaging with Pants", r"\[INFO\] Wrote ", finished=r"\[INFO\] Wrote ", summary=r"\[INFO\] Wrote .*"),
    StockReader("pio-run", "pio run*,platformio run*", "Building with PlatformIO", r"\] Processing |\[(?:SUCCESS|FAILED)\]|^\*\*\* \[|^Linking ", finished=r"\[SUCCESS\]", failed=r"\[FAILED\]|^\*\*\* \[", summary=r"={3,} \[(?:SUCCESS|FAILED)\] Took [0-9.]+ seconds"),
    StockReader("turbo", "turbo build*,turbo run build*", "Building with Turborepo", r"^\s*(?:Tasks|Cached|Time):|cache hit|FULL TURBO", finished=r"^\s*Tasks:", summary=r"^\s*Tasks:\s+.*"),
    StockReader("nx", "nx build*,nx run-many*,nx run *", "Building with Nx", r"\sNX\s|^Failed tasks:|^- \S+:\S+|Nx read the output", finished=r"Successfully ran target", failed=r"NX .* failed$|^Failed tasks:",
                  summary=r"NX\s+(?:Successfully ran target .*|Running target .* failed)"),
    StockReader("moon", "moon run*,moon check*,moon ci*", "Running moon tasks", r"^▮▮▮▮ |^(?:pass|skip) |^(?:Tasks|Actions): |^\s?Time: ", finished=r"^(?:Tasks|Actions): [0-9]+ completed", summary=r"^(?:Tasks|Actions): [0-9]+ completed.*"),
    StockReader("packer", "packer build*,packer validate*", "Building with Packer", r"^==> |^Build '.*' (?:finished|errored)|^Template validation failed|^Errors validating|^\* ", finished=r"^==> Builds finished", failed=r"^Template validation failed|^Errors validating|^Build '[^']+' errored",
                  summary=r"^==> Builds finished.*|^Template validation failed\..*|^Build '[^']+' (?:finished|errored).*"),
    StockReader("terraform", "terraform *", "Running Terraform", r"^Plan: |^Apply complete!|^Destroy complete!|^No changes\.|^Success!|^Terraform has been successfully initialized|^│ Error: |: (?:Creation|Modifications|Destruction) complete|: (?:Creating|Modifying|Destroying)\.\.\.",
                  finished=r"^Apply complete!|^Destroy complete!|^Terraform has been successfully initialized|^Success!|^Plan: |^No changes\.", failed=r"^│ Error: ",
                  summary=r"^Apply complete! .*|^Plan: .*|^Destroy complete! .*|^No changes\. .*|^Success! .*|^│ Error: .*|^Terraform has been successfully initialized!"),
    StockReader("curl", "curl -O*,curl -o *,curl * -O*,curl * -o *,curl * --output *,curl * --remote-name*", "Downloading", r"^curl: \(|^\s*[0-9]+\s+[0-9.]+[kMGTP]?\s+[0-9]+\s", r"^\s*([0-9]+)\s+[0-9.]+[kMGTP]?\s+[0-9]+\s", r"^\s*100\s+[0-9.]+[kMGTP]?\s+100\s",
                  r"^curl: \([0-9]+\)", r"^(curl: \([0-9]+\) .*)|^\s*100\s+([0-9.]+[kMGTP]?)\s+100\s"),
    StockReader("wget", "wget*", "Downloading", r"^--[0-9:]+--|saved \[|ERROR [0-9]+|^Length: |\b[0-9]+%", r"\b([0-9]+)%", r"saved \[", r"ERROR [0-9]+:", r"saved \[[0-9/]+\]|ERROR [0-9]+: .*"),
    StockReader("docker-pull", "docker pull *,docker image pull *", "Pulling image", r"^[0-9a-f]{12}: (?:Pulling fs layer|Download complete|Pull complete|Already exists)|^Digest: |^Status: |^Error response from daemon|^error pulling|: Pulling from ",
                  finished=r"^Status: ", failed=r"^Error response from daemon|^error pulling", summary=r"^Status: .*|^Error response from daemon: .*|^error pulling.*"),
    StockReader("composer-install", "composer install*,composer update*,composer require*", "Installing PHP packages", r"^Package operations: |^\s+- (?:Installing|Updating|Removing|Locking) |^Generating autoload|^Writing lock file|^In \S+ line [0-9]+:|Could not find a matching version",
                  finished=r"^Generating autoload files", failed=r"^In \S+ line [0-9]+:|Could not find a matching version|Your requirements could not be resolved", summary=r"^Package operations: .*|^\s+Could not find a matching version of package \S+"),
    StockReader("bundle-install", "bundle,bundle install*,bundle update*", "Installing Ruby gems", r"^(?:Installing|Using|Fetching) |^Bundle complete!|^\[!\]|^Could not |Bundler cannot continue", finished=r"^Bundle complete!", failed=r"^\[!\]|^Could not |^Bundler cannot continue",
                  summary=r"^Bundle complete! .*|^\[!\] .*|^Could not .*"),
    StockReader("gem-install", "gem install*,gem update*", "Installing Ruby gems", r"^Successfully installed |^[0-9]+ gems? installed|^ERROR: ", finished=r"^[0-9]+ gems? installed", failed=r"^ERROR: ", summary=r"^[0-9]+ gems? installed|^ERROR: .*"),
    StockReader("uv-install", "uv pip install*,uv add*,uv sync*,uv tool install*", "Installing Python packages", r"^(?:Resolved|Prepared|Installed|Uninstalled|Audited) [0-9]+ packages?|^ [+~-] |^error: |^\s+cause: ", finished=r"^(?:Installed|Audited) [0-9]+ packages?",
                  failed=r"^error: ", summary=r"^(?:Installed|Audited) [0-9]+ packages? .*|^error: .*"),
    StockReader("yarn-install", "yarn,yarn install*,yarn add*", "Installing packages", r"^\[[0-9]/[0-9]\] |^(?:success|error|warning) |^Done in |^yarn install v", r"^\[([0-9]+)/([0-9]+)\] ", r"^Done in |^success ", r"^error ", r"^Done in .*|^error .*|^success .*"),
    StockReader("pnpm-install", "pnpm install*,pnpm i,pnpm i *,pnpm add*", "Installing packages", r"Progress: resolved|Packages: \+|ERR_PNPM_", r"Progress: (?=.*added ([0-9]+))resolved ([0-9]+)", failed=r"ERR_PNPM_", summary=r"Progress: resolved [0-9]+, .*|ERR_PNPM_\w+ .*"),
    StockReader("brew-install", "brew install*,brew upgrade*,brew reinstall*", "Installing Homebrew packages", r"^==> |^Error: |^Warning: |^🍺", r"([0-9]+)(?:\.[0-9])?%$", r"^🍺 ", failed=r"^Error: |^Warning: No available formula", summary=r"^Error: .*|^🍺 .*"),
    StockReader("git-clone", "git clone*", "Cloning repository", r"^Cloning into|^remote: |^(?:Receiving|Resolving|Unpacking) (?:objects|deltas)|^Checking out files|^fatal: ", r"\b([0-9]+)%", r"^Checking out files: 100%|^Unpacking objects: 100%|^Checking connectivity\.\.\. done",
                  r"^fatal: |^remote: Repository not found", r"^fatal: .*|^Receiving objects: .*|^Unpacking objects: .*"),
    StockReader("ctest", "ctest*", "CMake tests", r"^[0-9]+/[0-9]+ Test +#|^[0-9]+% tests passed|^The following tests FAILED", r"^([0-9]+)/([0-9]+) Test +#", r"^[0-9]+% tests passed", r"\*\*\*Failed|[1-9][0-9]* tests failed out of|^The following tests FAILED",
                  r"tests passed, ([0-9]+ tests failed out of [0-9]+)", count=r"^[0-9]+/([0-9]+) Test +#", step=r"(?m)^[0-9]+/[0-9]+ Test +#[0-9]+: \S+ \.+\s*(?:(?P<passed>Passed)|(?P<failed>\*\*\*Failed))"),
    StockReader("bazel-test", "bazel test*", "Bazel tests", r"^//\S+\s+(?:\(cached\) )?(?:PASSED|FAILED)|^Executed [0-9]+ out of|^FAIL: |^INFO: Build completed", finished=r"^Executed [0-9]+ out of", failed=r"\sFAILED in |^FAIL: |^INFO: Build completed, [0-9]+ tests? FAILED",
                  summary=r"^Executed [0-9]+ out of [0-9]+ tests?.*", count=r"^Executed [0-9]+ out of ([0-9]+) tests?", step=r"(?m)^//\S+\s+(?:\(cached\) )?(?:(?P<passed>PASSED)|(?P<failed>FAILED))"),
    StockReader("judge", "journal sins*", "Judging the changes", r"^(?:[a-z][\w/-]*  \([0-9]+\)$|[0-9]+ sins? across|↳ checklist written|No sins found|Nothing to judge|✓ |✗ |⚠ |· this run refuses)",
                  progress=r"^(?:parsing|reading|detector) (\d+)/(\d+)$", finished=r"^(?:\d+ sins? across \d+ skills?\.$|✓ |↳ checklist written to )", failed=r"^(?:✗ |⚠ |· this run refuses)",
                  summary=r"(No sins found|Nothing to judge|[0-9]+ sins? across|this run refuses to read).*"),
)
