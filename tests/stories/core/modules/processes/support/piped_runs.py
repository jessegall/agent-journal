import os
import shlex
import subprocess
from pathlib import Path

from core.modules.processes.support.runner_line import STRIPPED_SEPARATOR, STRIPPED_VARIABLE
from tests.stories.core.modules.processes.support.read_output import ReadOutput
from tests.stories.server.support.alias_hook import AliasHook
from tests.stories.server.support.go_build import GoBuild

TEST_OUTPUT = "".join(f"line {number}\n" for number in range(1, 41)) + "40 passed\n"
RUN_LIMIT_SECONDS = 30


class PipedRuns(ReadOutput):
    """Runs lines through the real hook and the real runner, with an npm that prints a known test output."""

    def __init__(self, story, server) -> None:
        super().__init__(story)
        self.hook = AliasHook(server)
        program = self.bin / "npm"
        program.write_text(f"#!/bin/sh\nprintf '%s' '{TEST_OUTPUT}'\n")
        program.chmod(0o755)

    def fail_the_tests(self) -> None:
        (self.bin / "npm").write_text(f"#!/bin/sh\nprintf '%s' '{TEST_OUTPUT}'\nexit 1\n")

    def rewritten(self, line: str) -> list[str]:
        return shlex.split(str(self.hook.answer(line)["updatedInput"]["command"]))

    def variable(self, line: str, name: str) -> str:
        return next((token.split("=", 1)[1] for token in self.rewritten(line) if token.startswith(f"{name}=")), "")

    def run_line(self, line: str) -> tuple[str, Path]:
        rewritten = str(self.hook.answer(line)["updatedInput"]["command"])
        environment = GoBuild.environment(JOURNAL_HOME=str(self.story.home.folder), PATH=f"{self.bin}{os.pathsep}{os.environ['PATH']}")
        finished = subprocess.run(["sh", "-c", rewritten], capture_output=True, text=True, timeout=RUN_LIMIT_SECONDS, cwd=self.folder, env=environment)
        assert finished.returncode == 0, (finished.stdout, finished.stderr)
        tokens = shlex.split(rewritten)
        folder = self.story.home.folder / "processes" / tokens[tokens.index("--process") + 1]
        subprocess.run(["sh", "-c", 'while [ ! -e "$1" ]; do :; done', "wait", str(folder / "end")], timeout=RUN_LIMIT_SECONDS, check=True)
        return finished.stdout, folder

    def expect_variable(self, line: str, name: str, value: str) -> None:
        assert self.variable(line, name) == value, self.rewritten(line)

    def expect_stripped(self, line: str, *commands: str) -> None:
        assert self.stripped_commands(line) == list(commands), self.rewritten(line)

    def expect_run_output(self, line: str, text: str) -> Path:
        output, folder = self.run_line(line)
        assert text.format(process=folder.name) in output, output
        return folder

    def stripped_commands(self, line: str) -> list[str]:
        return [command for command in self.variable(line, STRIPPED_VARIABLE).split(STRIPPED_SEPARATOR) if command]
