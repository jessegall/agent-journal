import json
from collections.abc import Sequence
from pathlib import Path

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool_type import ToolType
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.helper_outcome import HelperOutcome
from core.base.provider.hook_decoder import HookDecoder
from core.base.provider.hook_file import HookFile
from core.base.provider.hook_trust import HookTrust
from core.base.provider.launch import Launch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.model_tier import ModelTier
from core.base.provider.program_model import ProgramModel
from core.base.provider.provider import Provider
from core.base.provider.refusal_style import RefusalStyle
from core.base.provider.transcript_row import TranscriptRow
from core.base.type_guards import is_list, is_mapping
from core.modules.codex.providers.support.codex_event import CodexEvent
from core.modules.codex.providers.support.codex_trust import CodexTrust

HOME_VARIABLE = "CODEX_HOME"
TRANSCRIPT_AUTHORS = ("user", "assistant")


class CodexProvider(Provider):
    """OpenAI's Codex: hooks in .codex/hooks.json, trusted per file and hook in its config.toml, rollouts under its
    sessions folder, and a session it names itself, which the first hook brings."""

    name = "codex"
    title = "Codex"
    executable = "codex"
    hook_events = {"SessionStart": HookEventName.SESSION_START, "UserPromptSubmit": HookEventName.PROMPT,
                   "PreToolUse": HookEventName.PRE_TOOL_USE, "PostToolUse": HookEventName.POST_TOOL_USE,
                   "PreCompact": HookEventName.COMPACT, "Stop": HookEventName.STOP,
                   "SubagentStart": HookEventName.SESSION_START, "SubagentStop": HookEventName.STOP,
                   "SessionEnd": HookEventName.SESSION_END}
    subagent_events = ["SubagentStart", "SubagentStop", "PreToolUse", "PostToolUse"]
    line_events = [HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE]
    refusals = {HookEventName.STOP: RefusalStyle.BLOCK}
    tool_categories = {"Bash": ToolType.SHELL, "apply_patch": ToolType.EDIT, "write_file": ToolType.NEW_FILE,
                       "read_file": ToolType.READ, "collaborationspawn_agent": ToolType.AGENT}
    decoder = HookDecoder.CODEX
    hook_file = HookFile(Path(".codex/hooks.json"), {"additionalContextLimit": 0})
    session_variable = "CODEX_THREAD_ID"
    markers = ["CODEX_THREAD_ID", "CODEX_SESSION_ID", "CODEX_TOOL_CALL_ID", "CODEX_CI", "CODEX_SANDBOX", "CODEX_VERSION",
               "CODEX_APPLY_PATCH_PRESERVE_LINE_ENDINGS"]
    models = [ProgramModel("gpt-5.6-luna", ModelTier.FAST), ProgramModel("gpt-5.6-terra", ModelTier.GENERAL), ProgramModel("gpt-6.1-sol", ModelTier.STRONGEST)]

    def session_command(self, launch: Launch) -> LaunchCommand:
        arguments = [self.executable, "--no-daemon", "-m", launch.model, "--dangerously-bypass-approvals-and-sandbox", *launch.session.arguments(self)]
        return LaunchCommand(arguments, launch.folder, launch.variables)

    def helper_command(self, launch: HelperLaunch) -> LaunchCommand:
        arguments = [self.executable, "exec", *launch.session.arguments(self), "--json", "--dangerously-bypass-approvals-and-sandbox",
                     "--dangerously-bypass-hook-trust", "-m", launch.model, launch.brief]
        return LaunchCommand(arguments, launch.folder, launch.variables)

    def new_session_arguments(self, session: str) -> Sequence[str]:
        return []

    def resumed_arguments(self, session: str) -> Sequence[str]:
        return ["resume", session]

    def helper_outcome(self, output: str, errors: str) -> HelperOutcome:
        events = list(CodexEvent.events(output))
        replies = [event.reply for event in events if event.is_reply() and event.reply is not None]
        failures = [event.error for event in events if event.is_failure() and event.error is not None]
        session = next((event.thread for event in events if event.is_thread_start()), "")
        return HelperOutcome(replies[-1].strip() if replies else errors.strip(), session, failures[-1] if failures else None)

    def transcript(self, project: Path, session: str) -> Path | None:
        sessions = self.folders.folder(HOME_VARIABLE, ".codex") / "sessions"
        return next(sessions.glob(f"**/rollout-*-{session}.jsonl"), None) if sessions.is_dir() else None

    def transcript_rows(self, path: Path) -> Sequence[TranscriptRow]:
        rows: list[TranscriptRow] = []
        for line in path.read_text().splitlines():
            fields: object = json.loads(line) if line.strip() else {}
            payload = fields.get("payload") if is_mapping(fields) else None
            role = payload.get("role") if is_mapping(payload) else None
            content = payload.get("content") if is_mapping(payload) else None
            if role in TRANSCRIPT_AUTHORS and is_list(content):
                text = "\n".join(str(block.get("text", "")) for block in content if is_mapping(block))
                if text.strip():
                    rows.append(TranscriptRow(str(role), str(role), text))
        return rows

    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None:
        self.trust_record().copied(root.resolve() / self.hook_file.path, folder.resolve() / self.hook_file.path)

    def hook_trust(self, project: Path) -> HookTrust:
        hook_file = project.resolve() / self.hook_file.path
        return self.trust_record().trust(hook_file, list(self.hook_events)) if hook_file.is_file() else HookTrust.UNWRITTEN

    def trust_record(self) -> CodexTrust:
        return CodexTrust(self.folders.folder(HOME_VARIABLE, ".codex") / "config.toml")
