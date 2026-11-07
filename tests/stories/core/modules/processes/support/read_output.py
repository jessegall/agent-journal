import os
import shlex
import subprocess

from tests.stories.server.support.alias_hook import AliasHook
from tests.stories.server.support.go_build import GoBuild


class ReadOutput:
    """Checks real hook rewrites and the runner's displayed and stored file output."""

    def __init__(self, story) -> None:
        self.story = story
        self.folder = story.home.folder.parent
        self.bin = story.home.folder / "bin"
        self.bin.mkdir(parents=True, exist_ok=True)
        GoBuild.built("journal-run", self.bin / "journal-run")
        GoBuild.built("journal", self.bin / "journal")

    def expect_reads(self, server) -> None:
        hook = AliasHook(server)
        for position, (size, complete) in enumerate([(2400, True), (16000, True), (20000, False)], start=1):
            path = self.folder / f"read-{position}.txt"
            text = "x" * size
            path.write_text(text)
            answer = hook.answer(f"cat {shlex.quote(str(path))}")
            rewritten = answer["updatedInput"]["command"]
            assert "--only-reads" in shlex.split(rewritten), rewritten
            finished = subprocess.run(
                ["sh", "-c", rewritten], capture_output=True, text=True, timeout=30, cwd=self.folder,
                env=GoBuild.environment(JOURNAL_HOME=str(self.story.home.folder), PATH=f"{self.bin}{os.pathsep}{os.environ['PATH']}"),
            )
            assert finished.returncode == 0, (finished.stdout, finished.stderr)
            assert (finished.stdout == text) == complete, (size, len(finished.stdout), finished.stdout[-300:])
            if not complete:
                assert len(finished.stdout) < 16000 and "journal output read" in finished.stdout, finished.stdout[-300:]
            tokens = shlex.split(rewritten)
            process = tokens[tokens.index("--process") + 1]
            assert (self.story.home.folder / "processes" / process / "1.out").read_text() == text
