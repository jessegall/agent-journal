from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_keywords import text_keywords
from core.modules.agents.models.agent import Agent
from core.modules.skills.commands.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener

NOTICE_OPENING = "["
PROMPT_ROLES = (AgentRole.MAIN, AgentRole.WORKER)


class KeywordSkillsListener(SkillListener):
    """A prompt of the user's that holds a keyword of a skill makes that skill due for the agent; a line the
    journal or a plugin put in the prompt, which opens with a bracket, and a prompt of a subagent do not."""

    name = "skills.keyword"
    event = "hook_call.create"

    def handle(self, event: LoggedEvent) -> None:
        call = self.call(event)
        if call.hook != HookEventName.PROMPT or call.summary.lstrip().startswith(NOTICE_OPENING):
            return
        if self.queries.query(Agent).find(call.agent_id).role not in PROMPT_ROLES:
            return
        terms = text_keywords(call.summary)
        for skill in self.registry.skills:
            if any(keyword.lower() in terms for keyword in skill.keywords):
                self.run(event, RequireSkill(call.agent_id, skill.folder))
