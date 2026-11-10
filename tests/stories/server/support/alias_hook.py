import json
import shlex
import subprocess

from engine.query.queries import Queries
from engine.driver.command_category import CommandCategory
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from tests.stories.server.support.go_build import GoBuild
from tests.stories.server.support.server_client import ServerStory


class AliasHook:
    """Runs the real hook against a scratch server and checks alias decisions and recorded commands."""

    def __init__(self, server: ServerStory, session: str = "s-1") -> None:
        self.server, self.session = server, session
        home = server.story.home
        (home.folder.parent / ".journal").symlink_to(home.folder, target_is_directory=True)
        self.binary = GoBuild.built("journal-hook", home.folder.parent / "journal-hook")

    def answer(self, line: str) -> dict[str, object]:
        home = self.server.story.home
        body = {"session_id": self.session, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": line}}
        finished = subprocess.run(
            [str(self.binary), "claude", str(home.folder.parent)], input=json.dumps(body), capture_output=True, text=True,
            cwd=home.folder.parent, timeout=30,
            env=GoBuild.environment(AGENT_JOURNAL_ACTIVE="1", JOURNAL_ENV="main", JOURNAL_ACTOR="agent"),
        )
        assert finished.returncode == 0, finished.stderr
        answer = json.loads(finished.stdout)
        return answer["hookSpecificOutput"]

    def expect_denied(self, line: str, reason: str) -> None:
        answer = self.answer(line)
        if answer.get("permissionDecision") == "deny":
            assert reason in str(answer.get("permissionDecisionReason")), answer
            return
        command = answer.get("updatedInput", {}).get("command", "")
        tokens = shlex.split(command)
        assert tokens[:2] == ["printf", "%s\\n"] and any(reason in token for token in tokens[2:]), answer

    def expect_expanded(self, line: str, expanded: str) -> str:
        answer = self.answer(line)
        assert answer.get("permissionDecision") == "allow", answer
        rewritten = answer["updatedInput"]["command"]
        assert shlex.split(rewritten)[-1] == expanded, rewritten
        process = next(row for row in self.server.story.container.get(Queries).query(Process).all_rows() if row.line == expanded)
        assert process.line == expanded, process
        return rewritten

    def expect_allowed(self, line: str) -> None:
        answer = self.answer(line)
        assert answer.get("permissionDecision") == "allow", answer

    def expect_options(self, line: str, expanded: str, reader_id: int) -> None:
        rewritten = self.expect_expanded(line, expanded)
        assert "--background" in shlex.split(rewritten), rewritten
        process = next(self.server.story.container.get(Queries).query(Process).all_rows())
        assert process.category is CommandCategory.CHECK, process
        self.server.story.expect_text("output show 1", f"reader_id: {reader_id}")

    def expect_visible_test_run(self, line: str, expanded: str) -> None:
        self.expect_expanded(line, expanded)
        part = next(self.server.story.container.get(Queries).query(ProcessPart).all_rows())
        assert part.category is CommandCategory.TEST_RUN and part.is_visible, part

    def expect_execution(self, line: str, expanded: str, output: str) -> None:
        self.expect_expanded(line, expanded)
        finished = subprocess.run(["bash", "-c", expanded], cwd=self.server.story.home.folder.parent,
                                  capture_output=True, text=True, timeout=10, env=GoBuild.environment())
        assert finished.returncode == 0 and finished.stdout == output, (finished.stdout, finished.stderr)
