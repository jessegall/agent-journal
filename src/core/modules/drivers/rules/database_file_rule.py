import re

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from engine.enums.command_category import CommandCategory
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.nudges.database_file_nudge import DatabaseFileNudge

DATABASE_PATH = re.compile(r"\.journal/version-5\.db(?:-wal|-shm)?(?![\w-])")
READ_ONLY_FLAG = "-readonly"
READING = (CommandCategory.READ, CommandCategory.SEARCH)


class DatabaseFileRule(DriverRule):
    """No agent writes the journal's database file from a shell line: a redirect into it, or a program that is not a
    read naming it, such as sqlite3 without -readonly; the refusal has no skip."""

    name = "drivers.database-file"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    overlay_proof = True
    single_action_refusal = "No agent writes the journal's database file by hand"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        writes = any(DATABASE_PATH.search(redirect) for redirect in shell.redirects) or any(self.writes_database(part) for part in shell.parts)
        return RuleAnswer.refused(DatabaseFileNudge.declared().nudge()) if writes else RuleAnswer.allowed()

    @staticmethod
    def writes_database(part: Part) -> bool:
        return DATABASE_PATH.search(part.text) is not None and READ_ONLY_FLAG not in part.arguments and part.classification.category not in READING
