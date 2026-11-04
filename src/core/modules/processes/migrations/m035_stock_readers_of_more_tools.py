from core.base.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import insert, quoted
from core.modules.processes.support.stock_reader import STOCK_READERS

EARLIER_READERS = ("make", "gcc", "cmake", "ruby-minitest", "rspec", "mix-test", "bun-test", "swift-test", "swift-build", "dotnet-build", "maven", "gradle", "webpack", "php-lint", "mypy", "ruff")
NEW_READERS = ("prove", "zig-test", "crystal-spec", "ginkgo", "meson-test", "deno-test", "dart-test", "dune-test", "cabal-test", "scala-cli-test", "sbt-test", "ng-test", "pio-test", "hatch-test", "tox", "nox", "dbt-test", "dbt",
               "cabal-build", "stack-build", "sbt-build", "ng-build", "hatch-build", "buck2-build", "pants-package", "pio-run", "turbo", "nx", "moon", "packer", "terraform",
               "curl", "wget", "docker-pull", "composer-install", "bundle-install", "gem-install", "uv-install", "yarn-install", "pnpm-install", "brew-install")


class StockReadersOfMoreToolsMigration(Migration):
    """Adds the stock readers of more test and build tools and of long downloads and installs, leaving a project's
    reader of the same name alone, gives the earlier new stock readers the count and step patterns their insert left
    out, and takes the default off the core's readers again, as the readers inserted since carry it."""

    number = 35
    readers = tuple(reader for reader in STOCK_READERS if reader.name in NEW_READERS + EARLIER_READERS)
    statements = tuple(insert(reader).replace("INSERT INTO", "INSERT OR IGNORE INTO") for reader in readers if reader.name in NEW_READERS) + tuple(
        f"UPDATE readers SET count_pattern = {quoted(reader.count)}, count_command = {quoted(reader.count_command)}, "
        f"step_pattern = {quoted(reader.step)} WHERE name = {quoted(reader.name)} AND creator_id = 1"
        for reader in readers
    ) + ("UPDATE readers SET is_default = 0 WHERE creator_id = 1",)
