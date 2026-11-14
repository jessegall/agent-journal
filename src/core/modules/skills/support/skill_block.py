from engine.driver.agent_hook import AgentHook
from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from core.modules.skills.states.skill_block_countdown import SkillBlockCountdown
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded


class SkillBlock:
    """Holds an agent until a skill is loaded, once its three tool uses have passed."""

    @staticmethod
    def answer(hook: AgentHook, nudge: Nudge, folder: str, strict: bool = False) -> RuleAnswer:
        return RuleAnswer.allowed().running(SkillBlockCountdown.start(hook, SkillLoaded(folder), refusal=nudge, strict=strict, skill=folder))
