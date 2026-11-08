from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

TOOL_RESTRICTION = NudgeDeclaration("drivers.tool_not_allowed", NudgeType.SAFETY_REFUSAL, "this driver allows no {category} tool")
COMMAND_RESTRICTION = NudgeDeclaration("drivers.command_not_allowed", NudgeType.SAFETY_REFUSAL, "this driver runs no {category} command")
READONLY = NudgeDeclaration("drivers.readonly", NudgeType.SAFETY_REFUSAL, "this driver reads and searches only; journal commands are allowed")
FILE_ACCESS_RESTRICTION = NudgeDeclaration("drivers.read_and_writes_only", NudgeType.SAFETY_REFUSAL, "this driver reads and writes files only; journal commands are allowed")
JOURNAL_RESTRICTION = NudgeDeclaration("drivers.journal_only", NudgeType.SAFETY_REFUSAL, "this driver runs journal commands only")
SHELL_RESTRICTION = NudgeDeclaration("drivers.no_shell", NudgeType.SAFETY_REFUSAL, "this driver runs no shell commands")
PROGRAM_RESTRICTION = NudgeDeclaration("drivers.program_not_allowed", NudgeType.SAFETY_REFUSAL, "this driver runs no {program} command")
GIT_RESTRICTION = NudgeDeclaration("drivers.no_git", NudgeType.SAFETY_REFUSAL, "this driver runs no git commands")
FULL_TEST_RESTRICTION = NudgeDeclaration("drivers.no_full_test_run", NudgeType.SAFETY_REFUSAL, "run the tests of the changed files; name the test files instead of running the whole suite", turn_limited=False)
UNJUDGED_LINE = NudgeDeclaration("drivers.unjudged_line", NudgeType.SAFETY_REFUSAL, "this line cannot be judged from its text: read with grep, or say in your report what should be run")
OLD_HOOK_LINE = NudgeDeclaration("drivers.old_hook_line", NudgeType.SAFETY_REFUSAL, "your hooks are too old to judge this line: update the journal, then start the agent again")
OUTWARD_JOURNAL_LINE = NudgeDeclaration("drivers.outward_journal_line", NudgeType.SAFETY_REFUSAL, "this command reaches past the journal: say in your report what should be run")
LIMITED_TOOL = NudgeDeclaration("drivers.limited_tool", NudgeType.SAFETY_REFUSAL, "a read-only agent has no {tool}: say in your report what you need")
UNKNOWN_AGENT = NudgeDeclaration("drivers.unknown_agent", NudgeType.SAFETY_REFUSAL, "the journal has no agent for this session, so this tool did not run: write in your report what happened")
ENDED_AGENT = NudgeDeclaration("drivers.ended_agent", NudgeType.SAFETY_REFUSAL, "this agent has ended: stop your work, nothing more is recorded")
NATIVE_SUBAGENT = NudgeDeclaration("drivers.native_subagent", NudgeType.SAFETY_REFUSAL, 'start a helper for this, with a profile and a brief')
NATIVE_SUBAGENT_WITHOUT_LAUNCH = NudgeDeclaration("drivers.native_subagent_no_launch", NudgeType.SAFETY_REFUSAL, "keep this work yourself: a helper needs a launch, and none runs")

PANIC_FILE = NudgeDeclaration("drivers.panic_file", NudgeType.SAFETY_REFUSAL, "the panic file is for a journal that does not answer: the journal answers you, so say in your report what is wrong")
PRIVATE_CORPUS = NudgeDeclaration("drivers.private_corpus", NudgeType.SAFETY_REFUSAL, "the private command corpus is read or run only in its sandboxed go test: say in your report what you need")

SKIP_WAITS_FOR_APPROVAL = NudgeDeclaration("drivers.skip_waits_for_approval", NudgeType.STEERING, "agent:{agent} confirmed a skip that waits for your answer: refusal-skip:{refusal}", turn_limited=False)
SKIP_APPROVED = NudgeDeclaration("drivers.skip_approved", NudgeType.STEERING, "your skip refusal-skip:{refusal} is approved: try again", turn_limited=False)
SKIP_DECLINED = NudgeDeclaration("drivers.skip_declined", NudgeType.STEERING, "your skip refusal-skip:{refusal} is declined: do what the refusal asks", turn_limited=False)
SKIPS_SPENT = NudgeDeclaration("drivers.skips_spent", NudgeType.STEERING, "agent:{agent} skipped {count} refusals in a row and lost the skip", turn_limited=False, wakes_agent=True)
ACCESS_NUDGES = [PANIC_FILE, PRIVATE_CORPUS, SKIPS_SPENT, SKIP_WAITS_FOR_APPROVAL, SKIP_APPROVED, SKIP_DECLINED, NATIVE_SUBAGENT, NATIVE_SUBAGENT_WITHOUT_LAUNCH, ENDED_AGENT, UNKNOWN_AGENT, UNJUDGED_LINE, OLD_HOOK_LINE, OUTWARD_JOURNAL_LINE, LIMITED_TOOL, TOOL_RESTRICTION, COMMAND_RESTRICTION, READONLY, FILE_ACCESS_RESTRICTION, JOURNAL_RESTRICTION,
                 SHELL_RESTRICTION, PROGRAM_RESTRICTION, GIT_RESTRICTION, FULL_TEST_RESTRICTION]
