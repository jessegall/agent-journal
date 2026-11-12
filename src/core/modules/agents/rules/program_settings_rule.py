from pathlib import Path

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.driver.tool import Tool
from engine.enums.hook_event_name import HookEventName
from engine.journal.journal_home import JournalHome
from core.modules.agents.support.program_settings_nudges import PROGRAM_SETTINGS_BAN
from engine.journal.journal_home import JOURNAL_FOLDER



class ProgramSettingsRule(DriverRule):
    """A write to the journal's own Claude Code or Codex settings, or to a file they depend on, is refused, under
    every overlay: the journal writes them at every start."""

    name = "agents.program-settings"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    exempt = True
    essential = True
    single_action_refusal = "A write to the journal's own Claude Code or Codex settings is refused"

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not any(spelling in text for text in self.tool_write_texts(tool) for spelling in self.spellings()):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(PROGRAM_SETTINGS_BAN.nudge())

    @staticmethod
    def tool_write_texts(tool: Tool) -> tuple[str, ...]:
        files = tool.files if tool.category.writes_files else ()
        if tool.shell is None:
            return files
        parts = tuple(part.text for part in tool.shell.parts if not part.classification.category.is_readonly)
        return (*files, *parts, *tool.shell.redirects)

    def protected_paths(self) -> tuple[Path, ...]:
        return (self.home.programs_folder, self.home.program_settings_backups.parent, self.home.program_settings_digests, self.home.hook_runner,
                self.home.hook_runner_choice, self.home.hook_runner_choice.parent / "hook.sh")

    def spellings(self) -> tuple[str, ...]:
        person_home = str(Path.home())
        markers = tuple(f"{JOURNAL_FOLDER}/{path.relative_to(self.home.folder)}" for path in self.protected_paths())
        folders = {spelled for path in self.protected_paths() for spelled in (str(path), str(path.resolve()))}
        home_folders = [folder for folder in folders if folder.startswith(f"{person_home}/")]
        return (*markers, *folders, *(folder.replace(person_home, "~", 1) for folder in home_folders), *(folder.replace(person_home, "$HOME", 1) for folder in home_folders))
