import pytest

from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.stock_reader import STOCK_READERS
from core.modules.processes.support.streaming_hints import STREAMING_HINTS
from tests.stories.core.modules.processes.support.stock_samples import STOCK_SAMPLES

# a command each pattern of the streaming hints stands for, so the test can ask which stock reader reads it
HINT_EXAMPLES = {
    "*vitest*": "npx vitest run", "*jest*": "npx jest", "*phpunit*": "vendor/bin/phpunit", "*pest*": "vendor/bin/pest", "*artisan test*": "artisan test",
    "*pytest*": "pytest tests", "*-m unittest*": "python3 -m unittest discover", "go test*": "go test ./...", "*gotestsum*": "gotestsum --format testname",
    "cargo test*": "cargo test", "*playwright test*": "npx playwright test", "*webpack*": "npx webpack", "*gradle*": "./gradlew build", "mvn*": "mvn -B test",
    "*mvnw*": "./mvnw test", "sbt*": "sbt test", "dotnet build*": "dotnet build", "dotnet test*": "dotnet test", "turbo*": "turbo run build",
    "*turbo run*": "turbo run build", "ctest*": "ctest", "docker build*": "docker build .", "docker buildx*": "docker buildx build .",
    "xcodebuild*": "xcodebuild test", "npm*run *": "npm run build", "pnpm*run *": "pnpm run build", "yarn *": "yarn build", "*python*": "python3 tools/deploy.py",
}
TOOLS_WITHOUT_STOCK_READER = {
    "*-m unittest*": "unittest has no stock reader yet; the four-readers task adds it",
    "*gotestsum*": "gotestsum has no stock reader yet; the four-readers task adds it",
    "*playwright test*": "playwright test has no stock reader yet; the four-readers task adds it",
    "xcodebuild*": "xcodebuild has no stock reader yet; the four-readers task adds it",
    "pnpm*run *": "a script run: what it prints is the output of the tool the script runs",
    "yarn *": "a script run: what it prints is the output of the tool the script runs",
    "*python*": "any Python program: there is no one output a reader could know",
}
SAMPLES_STILL_MISSING = (
    "pytest", "vitest", "dotnet-test", "phpunit", "cargo-nextest", "go-build", "go-vet", "make", "gcc", "cmake", "ruby-minitest", "rspec", "mix-test", "bun-test",
    "swift-test", "swift-build", "dotnet-build", "maven", "gradle", "webpack", "php-lint", "mypy", "ruff", "prove", "zig-test", "crystal-spec", "ginkgo",
    "meson-test", "deno-test", "dart-test", "flutter-test", "dune-test", "cabal-test", "scala-cli-test", "sbt-test", "ng-test", "pio-test", "hatch-test", "tox",
    "nox", "dbt-test", "dbt", "cabal-build", "stack-build", "sbt-build", "ng-build", "hatch-build", "buck2-build", "pants-package", "pio-run", "turbo", "nx",
    "moon", "packer", "terraform", "curl", "wget", "docker-pull", "composer-install", "bundle-install", "gem-install", "uv-install", "yarn-install",
    "pnpm-install", "brew-install", "git-clone", "ctest", "bazel-test",
)
HINT_PATTERNS = tuple(pattern for patterns, _ in STREAMING_HINTS for pattern in patterns.split(","))


@pytest.mark.parametrize("reader", STOCK_READERS, ids=[reader.name for reader in STOCK_READERS])
def test_every_stock_reader_has_a_recorded_sample_or_is_listed_as_missing(reader):
    names = {sample.name for sample in STOCK_SAMPLES}
    assert (reader.name in names) != (reader.name in SAMPLES_STILL_MISSING)


def test_the_list_of_missing_samples_names_only_stock_readers():
    assert set(SAMPLES_STILL_MISSING) <= {reader.name for reader in STOCK_READERS} and len(SAMPLES_STILL_MISSING) == len(set(SAMPLES_STILL_MISSING))


@pytest.mark.parametrize("sample", STOCK_SAMPLES, ids=[sample.name for sample in STOCK_SAMPLES])
def test_every_sample_says_where_its_output_came_from_and_has_a_stock_reader(sample):
    assert sample.source.strip() and sample.output.strip() and sample.name in {reader.name for reader in STOCK_READERS}


@pytest.mark.parametrize("pattern", HINT_PATTERNS)
def test_every_tool_with_a_streaming_hint_has_a_stock_reader_or_says_why_not(pattern):
    example = HINT_EXAMPLES[pattern]
    has_reader = any(ReaderSelection.matches(reader.commands, example) for reader in STOCK_READERS)
    assert has_reader != (pattern in TOOLS_WITHOUT_STOCK_READER), example
