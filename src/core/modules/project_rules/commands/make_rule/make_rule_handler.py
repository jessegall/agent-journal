from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.project_rules.commands.make_rule.make_rule import MakeRule
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.project_rule import ProjectRule
from core.modules.project_rules.support.rule_settings import RULE_APPROVAL_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues


class MakeRuleHandler(Handler[MakeRule, ProjectRule]):
    """Saves a rule: an agent's waits for a person's approval unless the setting lets agents make rules."""

    command = MakeRule

    def __init__(self, repository: Repository, settings: SettingValues) -> None:
        self.repository, self.settings = repository, settings

    def handle(self, command: MakeRule, context: Context) -> ProjectRule:
        needs_approval = context.actor.type is ActorType.AGENT and not self.settings.flag(RULE_APPROVAL_SETTING)
        state = RuleState.PROPOSED if needs_approval else RuleState.ACTIVE
        return self.repository.save(ProjectRule(creator_id=context.actor.id, text=command.text, state=state), context)
