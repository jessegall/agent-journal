from core.modules.skills.commands.request_skill.request_skill import RequestSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.loaded_skills import LoadedSkills
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_block import SkillBlock
from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST
from core.modules.triggers.support.trigger_nudges import TRIGGER_DENIES, TRIGGER_LINE
from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from core.modules.triggers.commands.fire_trigger.fire_trigger import FireTrigger
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery
from core.modules.triggers.support.trigger_conditions import TriggerConditions

MESSAGES_PLACE = "messages"
COMMANDS_PLACE = "commands"
FILES_PLACE = "files"


class PhraseTriggerRule(DriverRule):
    """A trigger whose words appear in a place it watches and that passes its conditions gives the agent its
    text or refuses the call; each one that acted counts as fired."""

    name = "triggers.phrase"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PROMPT
    single_action_refusal = "A trigger whose words appear where it watches hands the agent its text or refuses"

    def __init__(self, triggers: TriggerQuery, conditions: TriggerConditions, catalogue: SkillCatalogue, loaded: LoadedSkills, files: SkillFiles) -> None:
        self.triggers, self.conditions = triggers, conditions
        self.catalogue, self.loaded, self.files = catalogue, loaded, files

    def answer(self, hook: AgentHook) -> RuleAnswer:
        texts = [(place, text) for place, text in self.texts(hook) if text]
        matching = [trigger for trigger in self.triggers.phrased() if self.watches_phrase(trigger, texts) and self.conditions.all_pass(trigger, hook)] if texts else []
        skills = {skill.folder: skill for skill in self.catalogue.skills()} if any(trigger.action is TriggerAction.SKILL for trigger in matching) else {}
        matching = [trigger for trigger in matching if trigger.action is not TriggerAction.SKILL or trigger.skill in skills]
        deny = next((trigger for trigger in matching if trigger.action is TriggerAction.DENY), None)
        if deny is not None:
            return RuleAnswer.refused(TRIGGER_DENIES.nudge(trigger=deny.id)).running(FireTrigger(deny.id))
        if not matching:
            return RuleAnswer.allowed()
        loaded = self.loaded.names(hook.agent_id) if skills else ()
        missing = [trigger for trigger in matching if trigger.action is TriggerAction.SKILL and trigger.skill is not None and trigger.skill not in loaded]
        commands = [RequestSkill(hook.agent_id, folder) for folder in dict.fromkeys(trigger.skill for trigger in missing) if folder is not None]
        nudges = [TRIGGER_LINE.nudge(trigger=trigger.id) for trigger in matching if trigger.action is not TriggerAction.SKILL]
        if missing:
            folder = missing[0].skill
            if folder is not None:
                nudge = READ_SKILL_FIRST.nudge(instruction=self.files.instruction(folder, hook))
                if hook.event.event is HookEventName.PRE_TOOL_USE:
                    return SkillBlock.answer(hook, nudge, folder).running(*commands, *(FireTrigger(trigger.id) for trigger in matching))
                nudges.append(nudge)
        return RuleAnswer.with_nudges(*nudges).running(*commands, *(FireTrigger(trigger.id) for trigger in matching))

    def watches_phrase(self, trigger: Trigger, texts: list[tuple[str, str]]) -> bool:
        return any(trigger.match_mode.finds(phrase, text) for phrase in trigger.phrases for place, text in texts if place in trigger.watch_places)

    def texts(self, hook: AgentHook) -> list[tuple[str, str]]:
        event = hook.event
        if event.event is HookEventName.PROMPT:
            return [(MESSAGES_PLACE, event.prompt or "")]
        tool = event.tool
        if event.event is not HookEventName.PRE_TOOL_USE or tool is None:
            return []
        return [(COMMANDS_PLACE, part.text) for part in tool.shell.parts] if tool.shell is not None else [(FILES_PLACE, " ".join((tool.name, *tool.files)))]
