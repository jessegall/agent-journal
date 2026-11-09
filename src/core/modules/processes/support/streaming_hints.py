import re

from core.modules.processes.support.reader_selection import ReaderSelection

TEST_COMMAND_PATTERN = re.compile(r"\bgo test\b([^|;&]*)")
SERIAL_PACKAGES_PATTERN = re.compile(r"(^|\s)-p[= ]1(\s|$)")

GENERAL_HINT = "make it print its steps as it goes; stdbuf -oL makes a C program write each line"

# the commands of each tool, as a reader writes them, and how the tool prints while it runs, as report 1180 lists with its source
STREAMING_HINTS = (
    ("*vitest*", "run vitest with --reporter=verbose, which prints each test as it ends"),
    ("*jest*", "run jest with --verbose, which prints each test as it ends"),
    ("*phpunit*,*pest*,*artisan test*", "run it with --testdox, which prints each test as it ends"),
    ("*pytest*", "run pytest without -q so it prints its progress, or with -v for a line per test"),
    ("*-m unittest*", "run unittest with -v, which prints a line per test"),
    ("go test*", "run go test with -v, which logs each test as it runs"),
    ("*gotestsum*", "run gotestsum with --format testname, which prints a line per test"),
    ("cargo test*", "run cargo test with -- --no-capture, which shows what each test prints"),
    ("*playwright test*", "run playwright with --reporter=list, which prints a line per test"),
    ("*webpack*", "run webpack with --progress, which prints its progress as it builds"),
    ("*gradle*", "run gradle with --console=plain, which prints a line per task"),
    ("mvn*,*mvnw*", "run maven with -B -ntp, which prints plain lines"),
    ("sbt*", "run sbt with -Dsbt.supershell=false -Dsbt.ci=true, which prints plain lines"),
    ("dotnet build*", "run dotnet build with --tl:off, which prints plain lines"),
    ("dotnet test*", "run dotnet test with -v n, which prints more as it runs"),
    ("turbo*,*turbo run*", "run turbo with --ui=stream --log-order=stream, which prints each line at once"),
    ("ctest*", "run ctest with --progress, or -V for all its output"),
    ("docker build*,docker buildx*", "set BUILDKIT_PROGRESS=plain, which prints plain lines"),
    ("xcodebuild*", "set NSUnbufferedIO=YES, which writes each line at once"),
    ("npm*run *,pnpm*run *,yarn *", "read the script it runs and give that tool its own flag to print as it goes"),
    ("*python*", "it may hold its output back: print with flush=True, or run it with python3 -u"),
)


class StreamingHints:
    """What tells a quiet command to print while it runs: the hint of its tool, else the general one."""

    @staticmethod
    def hint(command: str) -> str:
        return next((hint for patterns, hint in STREAMING_HINTS if ReaderSelection.matches(patterns, command)), GENERAL_HINT)

    @staticmethod
    def is_serial_package_run(command: str) -> bool:
        match = TEST_COMMAND_PATTERN.search(command)
        if match is None or SERIAL_PACKAGES_PATTERN.search(match.group(1)):
            return False
        arguments = match.group(1).split()
        return any("..." in argument for argument in arguments) or sum(argument.startswith("./") for argument in arguments) > 1
