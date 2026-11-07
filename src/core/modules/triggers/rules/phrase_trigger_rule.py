from core.modules.skills.commands.request_skill.request_skill import RequestSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.triggers.support.trigger_nudges import TRIGGER_DENIES, TRIGGER_LINE
from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
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

    def __init__(self, triggers: TriggerQuery, conditions: TriggerConditions, catalogue: SkillCatalogue, rows: AgentSkillRows, files: SkillFiles) -> None:
        self.triggers, self.conditions = triggers, conditions
        self.catalogue, self.rows, self.files = catalogue, rows, files

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
        missing = [trigger for trigger in matching if trigger.action is TriggerAction.SKILL and trigger.skill is not None
                   and not self.rows.is_loaded(hook.agent_id, trigger.skill, skills[trigger.skill].digest)]
        commands = [RequestSkill(hook.agent_id, folder) for folder in dict.fromkeys(trigger.skill for trigger in missing) if folder is not None]
        nudges = [TRIGGER_LINE.nudge(trigger=trigger.id) for trigger in matching if trigger.action is not TriggerAction.SKILL]
        if missing:
            folder = missing[0].skill
            if folder is not None:
                nudge = READ_SKILL_FIRST.nudge(instruction=self.files.instruction(folder, hook))
                if hook.event.event is HookEventName.PRE_TOOL_USE:
                    return RuleAnswer.blocked(hook, nudge, SkillLoaded(folder)).running(*commands, *(FireTrigger(trigger.id) for trigger in matching))
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
