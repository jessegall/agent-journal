from core.modules.skills.declarations.skills_dependencies import SKILLS_DEPENDENCIES
from core.modules.skills.declarations.skills_subcommands import SKILLS_SUBCOMMANDS
from core.modules.skills.declarations.skills_handlers import SKILLS_HANDLERS
from core.modules.skills.declarations.skills_listeners import SKILLS_LISTENERS
from core.modules.skills.states.command_skill_states import CommandSkillStates
from core.modules.skills.states.skill_read_first_states import SkillReadFirstStates
from core.modules.skills.policies.loaded_skill_policy import LoadedSkillPolicy
from core.modules.skills.windows.skills_windows import SKILLS_WINDOWS
from core.modules.skills.models.declarations.agent_skill_model_declaration import AgentSkillModelDeclaration
from core.modules.skills.models.declarations.skill_request_model_declaration import SkillRequestModelDeclaration
from core.modules.skills.skills.declarations.skills_skills import SKILLS_SKILLS
from core.modules.skills.migrations.m003_skill_session import SkillSessionMigration
from core.modules.skills.support.skill_agent_messages import SKILL_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.skills.migrations.m001_skills import SkillsTablesMigration
from core.modules.skills.migrations.m002_skill_requests import SkillRequestsTableMigration
from core.modules.skills.seeders.skills_seeder import SkillsSeeder
from core.modules.skills.marks.skill_mark import SkillMark
from core.modules.skills.support.start_skills import SKILL_SETTINGS
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.block_conditions.skills_read import SkillsRead
from core.modules.skills.inspectors.skill_inspector import SkillInspector




class SkillsModule(Module):
    """Publishes skills and tracks what each agent must read."""

    name = "journal.core.skills"
    agent_messages = SKILL_AGENT_MESSAGES
    move_reason = "version 4 kept skills as files, not as a table"
    requires_engine = ">=7,<8"
    block_conditions = [SkillsRead, SkillLoaded]
    settings = SKILL_SETTINGS
    dependencies = SKILLS_DEPENDENCIES
    skills = SKILLS_SKILLS
    models = [AgentSkillModelDeclaration, SkillRequestModelDeclaration]
    migrations = [SkillSessionMigration, SkillsTablesMigration, SkillRequestsTableMigration]
    subcommands = SKILLS_SUBCOMMANDS
    handlers = SKILLS_HANDLERS
    listeners = SKILLS_LISTENERS
    marks = [SkillMark]
    states = [SkillReadFirstStates, CommandSkillStates]
    policies = [LoadedSkillPolicy]
    windows = SKILLS_WINDOWS
    inspectors = [SkillInspector]
    seeders = [SkillsSeeder]
