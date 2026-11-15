from functools import cache
from core.modules.secrets.nudges.secrets_folder_ban_nudge import SecretsFolderBanNudge
import json
from pathlib import Path

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.private.private_folder import PrivateFolder

MARKERS = ("agent-journal/secrets", ".journal/keys")


class SecretsFolderRule(DriverRule):
    """A tool that names the secrets folder, or version 4's folder of server keys, by any spelling of its path
    is refused: a secret reaches a program only through journal secret run."""

    name = "secrets.secrets-folder"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    essential = True
    single_action_refusal = "A tool that names the secrets folder, or version 4's folder of server keys, by any spelling of its path"

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None:
            return RuleAnswer.allowed()
        tool_texts = (*tool.files, *(tool.shell.part_texts if tool.shell is not None else ()), json.dumps(dict(hook.event.tool_input()), default=str))
        if not any(spelling in tool_text for tool_text in tool_texts for spelling in self.spellings()):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(SecretsFolderBanNudge.declared().nudge())

    def spellings(self) -> tuple[str, ...]:
        return folder_spellings(str(self.folder.folder), str(Path.home()))


# resolving the folder checks each folder of its path, so a server works the spellings out once per folder and home
@cache
def folder_spellings(folder: str, home: str) -> tuple[str, ...]:
    folders = {folder, str(Path(folder).resolve())}
    return (*MARKERS, *folders, *(spelling.replace(home, "~", 1) for spelling in folders if spelling.startswith(home)),
            *(spelling.replace(home, "$HOME", 1) for spelling in folders if spelling.startswith(home)))
