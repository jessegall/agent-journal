from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.skills.migrations.m001_skills import SkillsTablesMigration
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.commands.load_agent_skill import LoadAgentSkill
from core.modules.skills.commands.skill_list_subcommand import SkillListSubcommand
from core.modules.skills.commands.skill_write_subcommand import SkillWriteSubcommand


class SkillsModule(Module):
    """Adds the skills the modules declare: a list of them, and a write of their texts into the skill folders of
    the agent programs."""

    name = "journal.core.skills"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents"]
    models = [ModelDeclaration(AgentSkill, commands=[LoadAgentSkill])]
    migrations = [SkillsTablesMigration]
    subcommands = [SkillWriteSubcommand, SkillListSubcommand]
