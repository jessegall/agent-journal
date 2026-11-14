from engine.event.logged_event import LoggedEvent
from engine.driver.hook_keywords import text_keywords
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.drivers.events.prompt_submitted import PromptSubmitted

NOTICE_OPENING = "["


class KeywordSkillsListener(SkillListener[PromptSubmitted]):
    """A prompt of the user's that holds a keyword of a skill makes that skill due for the agent; a line the
    journal or a plugin put in the prompt, which opens with a bracket, and a prompt of a helper do not."""

    name = "skills.keyword"

    def handle(self, event: PromptSubmitted, logged: LoggedEvent) -> None:
        call = event.row
        if call.summary.lstrip().startswith(NOTICE_OPENING):
            return
        if self.agents.find(call.session_agent_id).role not in self.suites.agent_policy().prompt_roles:
            return
        terms = text_keywords(call.summary)
        for skill in self.catalogue.skills():
            if any(keyword.lower() in terms for keyword in skill.keywords):
                self.run(logged, RequireSkill(call.session_agent_id, skill.folder))
