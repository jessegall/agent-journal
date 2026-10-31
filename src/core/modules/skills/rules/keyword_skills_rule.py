from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_keywords import hook_keywords
from core.base.driver.rule_answer import RuleAnswer
from core.base.registry.registry import Registry
from core.modules.skills.commands.require_skill import RequireSkill

NOTICE_OPENING = "["


class KeywordSkillsRule(DriverRule):
    """A prompt of the user's that holds a keyword of a skill makes that skill due for the agent; a line the
    journal or a plugin put in the prompt, which opens with a bracket, and a subagent's prompt do not."""

    name = "skills.keyword"
    hook = HookEventName.PROMPT
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def answer(self, hook: AgentHook) -> RuleAnswer:
        prompt = hook.event.prompt or ""
        if hook.event.subagent or prompt.lstrip().startswith(NOTICE_OPENING):
            return RuleAnswer.allowed()
        terms = hook_keywords(hook.event)
        return RuleAnswer.allowed().running(*(RequireSkill(hook.agent_id, skill.folder) for skill in self.registry.skills
                                             if any(keyword.lower() in terms for keyword in skill.keywords)))
