from engine.driver.agent_hook import AgentHook
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.support.process_nudges import READING_PREVENTED
from core.modules.processes.support.reading.exit_texts import ExitTexts

EXIT_COMMANDS = ("output read", "output peek", "output page", "output stop", "reader", "refusal skip", "command-type")


class ReadingEnforcer:
    """The one place that presses an agent about reading: it turns a decision the engine kept into the answer of
    a hook, refusing a start the decision prevents with every exit stated, and never refuses a command that takes
    one of those exits. No decision feeds it yet, so it allows every hook."""

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed()

    @staticmethod
    def prevented(level: PressureLevel, name: str, output: int) -> RuleAnswer:
        return RuleAnswer.refused(READING_PREVENTED.nudge(output=output, hint=ExitTexts.listed(level.exits, name, output)))

    @staticmethod
    def answers_exit(hook: AgentHook) -> bool:
        """Whether the hook runs only commands that take an exit: reading or stopping the run, writing or marking a
        reader, skipping, or saying what type a command is."""
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        return shell is not None and shell.is_journal_command_line(*EXIT_COMMANDS)
