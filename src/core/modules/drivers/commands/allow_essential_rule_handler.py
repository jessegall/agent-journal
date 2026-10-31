from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.drivers.commands.allow_essential_rule import ALLOWANCE_SETTINGS, AllowEssentialRule
from core.modules.settings.models.setting import Setting
from core.modules.settings.commands.support.setting_store import SettingStore


class AllowEssentialRuleHandler(Handler[AllowEssentialRule, Setting]):
    """Writes the project setting that allows a rule marked essential; the guard drivers.known-setting refuses it
    from an agent."""

    command = AllowEssentialRule

    def __init__(self, registry: Registry, store: SettingStore) -> None:
        self.registry, self.store = registry, store

    def handle(self, command: AllowEssentialRule, context: Context) -> Setting:
        if not any(rule.name == command.rule and rule.claims_essential for rule in self.registry.rules):
            raise Refusal(f"no installed rule {command.rule} is marked essential", "journal driver show <driver> lists the rules")
        return self.store.write(f"{ALLOWANCE_SETTINGS}{command.rule}", True, None, context)
