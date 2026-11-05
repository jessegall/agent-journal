from core.modules.secrets.support.secret_nudges import SECRETS_FOLDER_BAN
import json
from pathlib import Path

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.private.private_folder import PrivateFolder

MARKERS = ("agent-journal/secrets", ".journal/keys")


class SecretsFolderRule(DriverRule):
    """A tool that names the secrets folder, or version 4's folder of server keys, by any spelling of its path
    is refused: a secret reaches a program only through journal secret run."""

    name = "secrets.secrets-folder"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    essential = True

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None:
            return RuleAnswer.allowed()
        tool_texts = (*tool.files, *(tool.shell.part_texts if tool.shell is not None else ()), json.dumps(dict(hook.event.tool_input()), default=str))
        if not any(spelling in tool_text for tool_text in tool_texts for spelling in self.spellings()):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(SECRETS_FOLDER_BAN.nudge())

    def spellings(self) -> tuple[str, ...]:
        home = str(Path.home())
        folders = {str(self.folder.folder), str(self.folder.folder.resolve())}
        return (*MARKERS, *folders, *(folder.replace(home, "~", 1) for folder in folders if folder.startswith(home)),
                *(folder.replace(home, "$HOME", 1) for folder in folders if folder.startswith(home)))
