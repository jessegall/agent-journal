from dataclasses import dataclass

from engine.enums.command_category import CommandCategory

KEPT_BEFORE = "an output of the tool run in this project, kept in stock_reader_catalog.py before 12 November 2026"


@dataclass(frozen=True)
class StockSample:
    """A recorded output of the command a stock reader is made for, and where the output came from."""

    name: str
    command: str
    category: CommandCategory
    output: str
    source: str


STOCK_SAMPLES = (
    StockSample("npm-build", "npm run build", CommandCategory.BUILD,
                "vite v6.4.5 building for production...\ntransforming...\n✓ 343 modules transformed.\nrendering chunks...\ncomputing gzip size...\n✓ built in 3.00s\n",
                f"vite 6.4.5: {KEPT_BEFORE}"),
    StockSample("npm-install", "npm ci", CommandCategory.PACKAGE,
                "added 95 packages, and audited 96 packages in 1s\n\n19 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities\n",
                f"npm ci: {KEPT_BEFORE}"),
    StockSample("pyright", "python3 -m pyright src", CommandCategory.CHECK, "0 errors, 0 warnings, 0 informations\n", f"pyright: {KEPT_BEFORE}"),
    StockSample("tsc", "npx tsc --noEmit missing.ts", CommandCategory.CHECK,
                "error TS6053: File 'missing.ts' not found.\n  The file is in the program because:\n    Root file specified for compilation\n",
                f"tsc on a missing file: {KEPT_BEFORE}"),
    StockSample("eslint", "npx eslint missing.js", CommandCategory.CHECK,
                'Oops! Something went wrong! :(\n\nESLint: 10.14.0\n\nNo files matching the pattern "missing.js" were found.\nPlease check for typing mistakes in the pattern.\n',
                f"ESLint 10.14.0 on a missing file: {KEPT_BEFORE}"),
    StockSample("pip-install", "pip3 install pip", CommandCategory.PACKAGE, "error: externally-managed-environment\n\n× This environment is externally managed\n",
                f"pip on a managed Python: {KEPT_BEFORE}"),
    StockSample("cargo-build", "cargo check", CommandCategory.CHECK, "error: could not find `Cargo.toml` in `project` or any parent directory\n",
                f"cargo outside a crate: {KEPT_BEFORE}"),
    StockSample("cargo-test", "cargo test", CommandCategory.TEST_RUN, "error: could not find `Cargo.toml` in `project` or any parent directory\n",
                f"cargo outside a crate: {KEPT_BEFORE}"),
    StockSample("docker-build", "docker build -f missing.Dockerfile .", CommandCategory.BUILD,
                "ERROR: failed to connect to the docker API at unix://docker.sock; check if the path is correct and if the daemon is running: dial unix docker.sock: "
                "connect: no such file or directory\n",
                f"docker with no daemon: {KEPT_BEFORE}"),
    StockSample("jest", "npx jest --listTests", CommandCategory.TEST_RUN,
                'Error: Could not find a config file based on provided values:\npath: "project"\ncwd: "project"\nConfig paths must be specified by either a direct path '
                "to a config\nfile, or a path to a directory.\n",
                f"jest with no config: {KEPT_BEFORE}"),
    StockSample("go-test", "go -C tools/journal-run test .", CommandCategory.TEST_RUN, "ok  \texample.org/project/tools/runner\t1.723s\n",
                f"go test of the runner: {KEPT_BEFORE}"),
)
