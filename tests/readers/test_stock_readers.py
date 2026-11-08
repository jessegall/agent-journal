import re
from pathlib import Path
from unittest.mock import Mock

import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.colour_codes import ColourCodes
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.step_tally import StepTally
from core.modules.processes.support.stock_reader import STOCK_READERS, StockReader

pytestmark = pytest.mark.reader_job

FIXTURES = Path(__file__).parent / "fixtures"
TEST_READERS = {"pytest", "vitest", "jest", "dotnet-test", "phpunit", "cargo-test", "cargo-nextest", "go-test", "ruby-minitest", "rspec", "mix-test", "bun-test", "swift-test", "prove", "zig-test", "crystal-spec", "ginkgo", "meson-test",
                "deno-test", "dart-test", "dune-test", "cabal-test", "scala-cli-test", "sbt-test", "ng-test", "pio-test", "hatch-test", "tox", "nox", "dbt-test", "flutter-test", "ctest", "bazel-test"}
CHECK_READERS = {"pyright", "tsc", "eslint", "go-vet", "php-lint", "mypy", "ruff"}
PACKAGE_READERS = {"npm-install", "pip-install", "curl", "wget", "docker-pull", "composer-install", "bundle-install", "gem-install", "uv-install", "yarn-install", "pnpm-install", "brew-install", "git-clone"}
STEPS_WITHOUT_FAILURE = {"dune-test", "cabal-test"}
ADDED_STEPPED = {"prove", "zig-test", "crystal-spec", "ginkgo", "meson-test", "deno-test", "dart-test", "dune-test", "cabal-test", "scala-cli-test", "sbt-test", "pio-test", "tox", "nox", "ctest", "bazel-test"}
READERS_WITH_A_SINGLE_OUTPUT = {"hatch-test", "dbt-test", "cabal-test", "pio-test", "flutter-test", "ctest"}
READERS = {reader.name: reader for reader in STOCK_READERS}
SAMPLES = sorted(FIXTURES.glob("*/*.out"))


def category_of(name: str) -> CommandCategory:
    if name in TEST_READERS:
        return CommandCategory.TEST_RUN
    if name in CHECK_READERS:
        return CommandCategory.CHECK
    return CommandCategory.PACKAGE if name in PACKAGE_READERS else CommandCategory.BUILD


def reader_row(stock: StockReader) -> Reader:
    return Reader(id=1, version=1, creator_id=1, name=stock.name, type=ReaderType.PATTERN, commands=stock.commands, title=stock.title, lines_pattern=stock.lines, progress_pattern=stock.progress,
                  finished_pattern=stock.finished, failed_pattern=stock.failed, summary_pattern=stock.summary, count_pattern=stock.count, count_command=stock.count_command, step_pattern=stock.step)


def judge() -> ReaderJudge:
    return ReaderJudge(ReaderRun(), Mock(spec=OutputFolder), Mock(spec=ProcessPartQuery))


def sample_id(sample: Path) -> str:
    return f"{sample.parent.name}-{sample.stem}"


def test_every_stock_reader_has_a_fixture():
    assert sorted(set(READERS) - {sample.parent.name for sample in SAMPLES}) == []


def test_every_fixture_belongs_to_a_stock_reader():
    assert sorted({sample.parent.name for sample in SAMPLES} - set(READERS)) == []


def test_a_passed_and_a_failed_output_exist_for_every_test_reader():
    assert sorted(name for name in TEST_READERS - READERS_WITH_A_SINGLE_OUTPUT if not (FIXTURES / name / "failed.out").exists() or not (FIXTURES / name / "passed.out").exists()) == []


def test_a_test_reader_with_one_output_has_it_in_its_folder():
    assert sorted(name for name in READERS_WITH_A_SINGLE_OUTPUT if not (FIXTURES / name / "passed.out").exists()) == []


@pytest.mark.parametrize("sample", [sample for sample in SAMPLES if sample.with_suffix(".source").exists()], ids=sample_id)
def test_a_sourced_output_names_its_page_or_says_it_was_run(sample):
    source = sample.with_suffix(".source").read_text().strip()
    assert source.startswith(("https://", "http://", "ran on ")), source


@pytest.mark.parametrize("sample", SAMPLES, ids=sample_id)
def test_the_reader_reads_the_command_of_its_output(sample):
    reader = reader_row(READERS[sample.parent.name])
    command = sample.with_suffix(".command").read_text().strip()
    assert ReaderSelection.reads_command(reader, command, category_of(reader.name)), command


@pytest.mark.parametrize("sample", SAMPLES, ids=sample_id)
def test_the_reader_finds_a_summary_and_passes_the_judge(sample):
    reader = reader_row(READERS[sample.parent.name])
    text = ColourCodes.removed(sample.read_text())
    assert ReaderRun().summary(reader, text), text[-300:]
    assert judge().misses(reader, category_of(reader.name), text) == ()


@pytest.mark.parametrize("sample", [sample for sample in SAMPLES if sample.stem == "failed"], ids=sample_id)
def test_a_failed_output_is_marked_failed(sample):
    stock = READERS[sample.parent.name]
    assert re.search(stock.failed, ColourCodes.removed(sample.read_text()), re.MULTILINE), stock.failed


@pytest.mark.parametrize("sample", [sample for sample in SAMPLES if sample.stem == "passed" and READERS[sample.parent.name].failed], ids=sample_id)
def test_a_passed_output_is_not_marked_failed(sample):
    stock = READERS[sample.parent.name]
    assert not re.search(stock.failed, ColourCodes.removed(sample.read_text()), re.MULTILINE), stock.failed


@pytest.mark.parametrize("name", sorted(TEST_READERS))
def test_a_test_reader_has_every_field_a_test_needs(name):
    assert judge().fields_missing(reader_row(READERS[name]), CommandCategory.TEST_RUN) == ()


@pytest.mark.parametrize("sample", [sample for sample in SAMPLES if sample.stem == "passed" and sample.parent.name in ADDED_STEPPED], ids=sample_id)
def test_the_steps_of_a_passed_output_are_counted_as_passed(sample):
    stock = READERS[sample.parent.name]
    counts = StepTally.counted(stock.step, stock.progress, ColourCodes.removed(sample.read_text()))
    assert counts.passed > 0 and counts.failed == 0, counts


@pytest.mark.parametrize("sample", [sample for sample in SAMPLES if sample.stem == "failed" and sample.parent.name in ADDED_STEPPED - STEPS_WITHOUT_FAILURE], ids=sample_id)
def test_the_steps_of_a_failed_output_include_a_failure(sample):
    stock = READERS[sample.parent.name]
    assert StepTally.counted(stock.step, stock.progress, ColourCodes.removed(sample.read_text())).failed > 0


@pytest.mark.parametrize("name", sorted(set(READERS) - TEST_READERS))
def test_a_stock_reader_has_the_fields_of_its_category(name):
    assert judge().fields_missing(reader_row(READERS[name]), category_of(name)) == ()


def test_no_fixture_names_a_home_folder_other_than_the_made_up_user():
    folder = Path(__file__).parent / "fixtures"
    homes = {match for path in folder.rglob("*") if path.is_file() for match in re.findall(r"/(?:Users|home)/[\w.-]+", path.read_text(errors="replace"))}
    assert homes <= {"/home/user", "/Users/user"}, sorted(homes)

