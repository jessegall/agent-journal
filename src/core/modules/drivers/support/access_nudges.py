from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

TOOL_RESTRICTION = NudgeDeclaration("drivers.tool_not_allowed", NudgeType.SAFETY_REFUSAL, "This driver allows no {category} tools")
COMMAND_RESTRICTION = NudgeDeclaration("drivers.command_not_allowed", NudgeType.SAFETY_REFUSAL, "This driver cannot run {category} commands")
READONLY = NudgeDeclaration("drivers.readonly", NudgeType.SAFETY_REFUSAL, "This driver only reads and searches, plus journal commands")
FILE_ACCESS_RESTRICTION = NudgeDeclaration("drivers.read_and_writes_only", NudgeType.SAFETY_REFUSAL, "This driver only reads and writes files, plus journal commands")
JOURNAL_RESTRICTION = NudgeDeclaration("drivers.journal_only", NudgeType.SAFETY_REFUSAL, "This driver runs journal commands only")
SHELL_RESTRICTION = NudgeDeclaration("drivers.no_shell", NudgeType.SAFETY_REFUSAL, "This driver runs no shell commands")
PROGRAM_RESTRICTION = NudgeDeclaration("drivers.program_not_allowed", NudgeType.SAFETY_REFUSAL, "This driver cannot run {program}")
UNJUDGED_LINE = NudgeDeclaration("drivers.unjudged_line", NudgeType.SAFETY_REFUSAL, "This line cannot be judged from its text: read with grep, or say in your report what should be run")
OLD_HOOK_LINE = NudgeDeclaration("drivers.old_hook_line", NudgeType.SAFETY_REFUSAL, "Your hooks are too old to judge this line: update the journal, then restart the agent")
OUTWARD_JOURNAL_LINE = NudgeDeclaration("drivers.outward_journal_line", NudgeType.SAFETY_REFUSAL, "This command reaches outside the journal: say in your report what should be run")
LIMITED_TOOL = NudgeDeclaration("drivers.limited_tool", NudgeType.SAFETY_REFUSAL, "Read-only agents have no {tool}: say in your report what you need")
UNKNOWN_AGENT = NudgeDeclaration("drivers.unknown_agent", NudgeType.SAFETY_REFUSAL, "No journal agent exists for this session, so the tool did not run: say in your report what happened")
ENDED_AGENT = NudgeDeclaration("drivers.ended_agent", NudgeType.SAFETY_REFUSAL, "This agent has ended: stop now, nothing more is recorded")
REPLACED_SESSION = NudgeDeclaration("drivers.replaced_session", NudgeType.SAFETY_REFUSAL, "A newer session of agent {agent} replaced this one: stop now, nothing more is recorded")
NATIVE_SUBAGENT = NudgeDeclaration("drivers.native_subagent", NudgeType.SAFETY_REFUSAL, "Start a helper for this, with a profile and a brief")
NATIVE_SUBAGENT_WITHOUT_LAUNCH = NudgeDeclaration("drivers.native_subagent_no_launch", NudgeType.SAFETY_REFUSAL, "No helper launch is running: do this work yourself")

PANIC_FILE = NudgeDeclaration("drivers.panic_file", NudgeType.SAFETY_REFUSAL, "The panic file is only for a journal that does not answer: it answers you, so report what is wrong instead")
PRIVATE_CORPUS = NudgeDeclaration("drivers.private_corpus", NudgeType.SAFETY_REFUSAL, "The private command corpus is only read or run in its sandboxed go test: say in your report what you need")

SKIP_NEEDS_APPROVAL = NudgeDeclaration("drivers.skip_waits_for_approval", NudgeType.STEERING, "agent:{agent} confirmed a skip that needs your answer: refusal-skip:{refusal}", turn_limited=False)
SKIP_APPROVED = NudgeDeclaration("drivers.skip_approved", NudgeType.STEERING, "Skip refusal-skip:{refusal} approved: try again", turn_limited=False)
SKIP_DECLINED = NudgeDeclaration("drivers.skip_declined", NudgeType.STEERING, "Skip refusal-skip:{refusal} declined: do what the refusal asks", turn_limited=False)
SKIPS_SPENT = NudgeDeclaration("drivers.skips_spent", NudgeType.STEERING, "agent:{agent} skipped {count} refusals in a row and lost the right to skip", turn_limited=False, wakes_agent=True)
ACCESS_NUDGES = [PANIC_FILE, PRIVATE_CORPUS, SKIPS_SPENT, SKIP_NEEDS_APPROVAL, SKIP_APPROVED, SKIP_DECLINED, NATIVE_SUBAGENT, NATIVE_SUBAGENT_WITHOUT_LAUNCH, ENDED_AGENT, REPLACED_SESSION, UNKNOWN_AGENT, UNJUDGED_LINE, OLD_HOOK_LINE, OUTWARD_JOURNAL_LINE, LIMITED_TOOL, TOOL_RESTRICTION, COMMAND_RESTRICTION, READONLY, FILE_ACCESS_RESTRICTION, JOURNAL_RESTRICTION,
                 SHELL_RESTRICTION, PROGRAM_RESTRICTION]
