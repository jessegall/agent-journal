from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.skills.migrations.m001_skills import SkillsTablesMigration
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from core.modules.skills.rules.keyword_skills_rule import KeywordSkillsRule
from core.modules.skills.listeners.compaction_reset_listener import CompactionResetListener
from core.modules.skills.listeners.skill_event_listener import SkillEventListener
from core.modules.skills.listeners.start_skills_listener import StartSkillsListener
from core.modules.skills.listeners.skill_read_listener import SkillReadListener
from core.modules.skills.commands.load_agent_skill import LoadAgentSkill
from core.modules.skills.commands.load_skill_handler import LoadSkillHandler
from core.modules.skills.commands.require_skill_handler import RequireSkillHandler
from core.modules.skills.commands.require_skill_subcommand import RequireSkillSubcommand
from core.modules.skills.commands.reset_skills_handler import ResetSkillsHandler
from core.modules.skills.commands.skill_list_subcommand import SkillListSubcommand
from core.modules.skills.commands.skill_write_subcommand import SkillWriteSubcommand


class SkillsModule(Module):
    """Adds the skills the modules declare: a list of them, and a write of their texts into the skill folders of
    the agent programs."""

    name = "journal.core.skills"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.settings"]
    models = [ModelDeclaration(AgentSkill, commands=[LoadAgentSkill])]
    migrations = [SkillsTablesMigration]
    subcommands = [SkillWriteSubcommand, SkillListSubcommand, RequireSkillSubcommand]
    handlers = [RequireSkillHandler, LoadSkillHandler, ResetSkillsHandler]
    listeners = [SkillReadListener, CompactionResetListener, StartSkillsListener, SkillEventListener]
    driver_rules = [KeywordSkillsRule, SkillReadFirstRule]
