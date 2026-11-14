import json
import subprocess
from collections.abc import Mapping
from contextlib import contextmanager

from engine.provider.program_hooks import ProgramHooks
from tests.integration.support.go_build import GoBuild
from tests.stories.server.support.server_client import server_story

HOOK_SECONDS = 30


class ManagedHookRuns:
    """The project's own Claude Code hooks, taken over by the journal, and the built hook program the agent's
    program runs with a hook body, against the running journal: what it prints is what the agent is answered."""

    def __init__(self, story) -> None:
        self.story = story
        self.root = story.home.folder.parent
        if not (self.root / ".journal").exists():
            (self.root / ".journal").symlink_to(story.home.folder, target_is_directory=True)
        self.binary = GoBuild.built("journal-hook", self.root / "journal-hook")

    def managed(self, hooks: Mapping[str, list[object]]) -> None:
        ProgramHooks.store(self.story.home.project_folder / ".claude/settings.json", {"hooks": hooks})
        self.story.expect_text(f'program manage claude "{self.story.home.project_folder}"', "managed hooks:")

    def answer(self, body: Mapping[str, object], session: str = "s-1") -> subprocess.CompletedProcess[str]:
        return subprocess.run([str(self.binary), "claude", str(self.root)], input=json.dumps({"session_id": session, **body}), capture_output=True, text=True,
                              cwd=self.root, timeout=HOOK_SECONDS, env=GoBuild.environment(AGENT_JOURNAL_ACTIVE="1", JOURNAL_ENV="main", JOURNAL_ACTOR="agent"))

    def tool(self, name: str, tool_input: Mapping[str, object], event: str = "PreToolUse") -> subprocess.CompletedProcess[str]:
        return self.answer({"hook_event_name": event, "tool_name": name, "tool_input": tool_input, "cwd": str(self.root)})


def context_line(text: str) -> str:
    """The shell command of a project hook that answers with a line of context for the agent."""
    return "printf '%s' " + json.dumps(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", "additionalContext": text}}))


def entry(command: str, **fields: object) -> dict[str, object]:
    return {"type": "command", "command": command, "timeout": 10, **fields}


@contextmanager
def running_journal(story):
    with server_story(story):
        yield ManagedHookRuns(story)
