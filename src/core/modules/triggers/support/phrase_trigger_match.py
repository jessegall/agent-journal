from core.modules.skills.commands.request_skill.request_skill import RequestSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.loaded_skills import LoadedSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.agent_messages.read_skill_first_message import ReadSkillFirstMessage
from core.modules.triggers.agent_messages.trigger_denies_message import TriggerDeniesMessage
from core.modules.triggers.agent_messages.trigger_line_message import TriggerLineMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.triggers.commands.fire_trigger.fire_trigger import FireTrigger
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery
from core.modules.triggers.support.trigger_conditions import TriggerConditions

from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.triggers.support.phrase_trigger_answer import PhraseTriggerAnswer

MESSAGES_PLACE = "messages"
COMMANDS_PLACE = "commands"
FILES_PLACE = "files"
PHRASE_TRIGGER_KEY = "triggers.phrase"


class PhraseTriggerMatch:
    """A trigger whose words appear in a place it watches and that passes its conditions gives the agent its text,
    holds it to a skill or refuses the call; each one that acted counts as fired. Read once a hook, so the policy,
    the lines, the hold and the effect share one answer."""

    def __init__(self, triggers: TriggerQuery, conditions: TriggerConditions, catalogue: SkillCatalogue, loaded: LoadedSkills, files: SkillFiles,
                 agents: AgentRows, request_values: RequestValues) -> None:
        self.triggers, self.conditions = triggers, conditions
        self.catalogue, self.loaded, self.files, self.agents, self.request_values = catalogue, loaded, files, agents, request_values

    def answer(self, event: HookEvent, agent_id: int) -> PhraseTriggerAnswer:
        # read once a hook whatever changes meanwhile: the triggers it fires change the counts their conditions read
        return self.request_values.read(f"triggers.phrase:{agent_id}:{event.event_id}", lambda: event.event_id, lambda: self.matched(event, agent_id))

    def matched(self, event: HookEvent, agent_id: int) -> PhraseTriggerAnswer:
        texts = [(place, text) for place, text in self.texts(event) if text]
        matching = [trigger for trigger in self.triggers.phrased() if self.watches_phrase(trigger, texts) and self.conditions.all_pass(trigger, event, agent_id)] if texts else []
        skills = {skill.folder: skill for skill in self.catalogue.skills()} if any(trigger.action is TriggerAction.SKILL for trigger in matching) else {}
        matching = [trigger for trigger in matching if trigger.action is not TriggerAction.SKILL or trigger.skill in skills]
        deny = next((trigger for trigger in matching if trigger.action is TriggerAction.DENY), None)
        if deny is not None:
            return PhraseTriggerAnswer(TriggerDeniesMessage.declared().agent_message(trigger=deny.id), (), None, (FireTrigger(deny.id),))
        if not matching:
            return PhraseTriggerAnswer(None, (), None, ())
        loaded = self.loaded.names(agent_id) if skills else ()
        missing = [trigger for trigger in matching if trigger.action is TriggerAction.SKILL and trigger.skill is not None and trigger.skill not in loaded]
        commands = (*(RequestSkill(agent_id, folder) for folder in dict.fromkeys(trigger.skill for trigger in missing) if folder is not None), *(FireTrigger(trigger.id) for trigger in matching))
        agent_messages = [TriggerLineMessage.declared().agent_message(trigger=trigger.id) for trigger in matching if trigger.action is not TriggerAction.SKILL]
        folder = missing[0].skill if missing else None
        if folder is None:
            return PhraseTriggerAnswer(None, tuple(agent_messages), None, commands)
        agent_message = ReadSkillFirstMessage.instructed(self.files.agent_instruction(folder, self.agents.find(agent_id)))
        # before a tool the skill holds the agent's tools; at a prompt it is asked for in a line
        if event.event is HookEventName.PRE_TOOL_USE:
            return PhraseTriggerAnswer(None, tuple(agent_messages), (agent_message, folder), commands)
        return PhraseTriggerAnswer(None, (*agent_messages, agent_message), None, commands)

    @staticmethod
    def watches_phrase(trigger: Trigger, texts: list[tuple[str, str]]) -> bool:
        return any(trigger.match_mode.finds(phrase, text) for phrase in trigger.phrases for place, text in texts if place in trigger.watch_places)

    @staticmethod
    def texts(event: HookEvent) -> list[tuple[str, str]]:
        if event.event is HookEventName.PROMPT:
            return [(MESSAGES_PLACE, event.prompt or "")]
        tool = event.tool
        if event.event is not HookEventName.PRE_TOOL_USE or tool is None:
            return []
        return [(COMMANDS_PLACE, part.text) for part in tool.shell.parts] if tool.shell is not None else [(FILES_PLACE, " ".join((tool.name, *tool.files)))]
