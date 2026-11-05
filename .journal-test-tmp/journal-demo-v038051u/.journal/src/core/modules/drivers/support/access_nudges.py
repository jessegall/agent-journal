from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

TOOL_RESTRICTION = NudgeDeclaration("drivers.tool_not_allowed", NudgeType.REFUSAL, "this driver allows no {category} tool")
COMMAND_RESTRICTION = NudgeDeclaration("drivers.command_not_allowed", NudgeType.REFUSAL, "this driver runs no {category} command")
READONLY = NudgeDeclaration("drivers.readonly", NudgeType.REFUSAL, "this driver reads and searches only; journal commands are allowed")
FILE_ACCESS_RESTRICTION = NudgeDeclaration("drivers.read_and_writes_only", NudgeType.REFUSAL, "this driver reads and writes files only; journal commands are allowed")
JOURNAL_RESTRICTION = NudgeDeclaration("drivers.journal_only", NudgeType.REFUSAL, "this driver runs journal commands only")
SHELL_RESTRICTION = NudgeDeclaration("drivers.no_shell", NudgeType.REFUSAL, "this driver runs no shell commands")
SUBAGENT_RESTRICTION = NudgeDeclaration("drivers.no_subagents", NudgeType.REFUSAL, "this driver sends no subagents")
PROGRAM_RESTRICTION = NudgeDeclaration("drivers.program_not_allowed", NudgeType.REFUSAL, "this driver runs no {program} command")
GIT_RESTRICTION = NudgeDeclaration("drivers.no_git", NudgeType.REFUSAL, "this driver runs no git commands")
FULL_TEST_RESTRICTION = NudgeDeclaration("drivers.no_full_test_run", NudgeType.REFUSAL, "run the tests of the changed files; name the test files instead of running the whole suite", turn_limited=False)

ACCESS_NUDGES = [TOOL_RESTRICTION, COMMAND_RESTRICTION, READONLY, FILE_ACCESS_RESTRICTION, JOURNAL_RESTRICTION,
                 SHELL_RESTRICTION, SUBAGENT_RESTRICTION, PROGRAM_RESTRICTION, GIT_RESTRICTION, FULL_TEST_RESTRICTION]
