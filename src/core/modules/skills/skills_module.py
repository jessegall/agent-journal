from core.modules.skills.listeners.kept_skills_record_listener import KeptSkillsRecordListener
from core.modules.skills.needs.command_skill_needs import CommandSkillNeeds
from core.modules.skills.needs.skill_read_first_needs import SkillReadFirstNeeds
from core.modules.skills.policies.loaded_skill_policy import LoadedSkillPolicy
from core.modules.skills.windows.skills_windows import SKILLS_WINDOWS
from core.modules.skills.models.declarations.agent_skill_model_declaration import AgentSkillModelDeclaration
from core.modules.skills.models.declarations.skill_request_model_declaration import SkillRequestModelDeclaration
from core.modules.skills.skills.declarations.skills_skills import SKILLS_SKILLS
from core.modules.skills.commands.set_required_skill.set_required_skill_handler import SetRequiredSkillHandler
from core.modules.skills.commands.set_required_skill.set_required_skill_subcommand import SetRequiredSkillSubcommand
from core.modules.skills.commands.skill_requirements.skill_requirements_subcommand import SkillRequirementsSubcommand
from core.modules.skills.migrations.m003_skill_session import SkillSessionMigration
from core.modules.skills.listeners.skill_publish_listener import SkillPublishListener
from core.modules.skills.support.skill_agent_messages import SKILL_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.skills.commands.agent_skill_unread.agent_skill_unread_subcommand import AgentSkillUnreadSubcommand
from core.modules.skills.commands.load_skill.load_skill_handler import LoadSkillHandler
from core.modules.skills.commands.request_skill.request_skill_handler import RequestSkillHandler
from core.modules.skills.commands.require_skill.require_skill_handler import RequireSkillHandler
from core.modules.skills.commands.require_skill.require_skill_subcommand import RequireSkillSubcommand
from core.modules.skills.commands.reset_skills.reset_skills_handler import ResetSkillsHandler
from core.modules.skills.commands.skill_list.skill_list_subcommand import SkillListSubcommand
from core.modules.skills.commands.skill_required.skill_required_subcommand import SkillRequiredSubcommand
from core.modules.skills.commands.skill_show.skill_show_subcommand import SkillShowSubcommand
from core.modules.skills.commands.skill_write.skill_write_subcommand import SkillWriteSubcommand
from core.modules.skills.listeners.command_skill_listener import CommandSkillListener
from core.modules.skills.listeners.compaction_reset_listener import CompactionResetListener
from core.modules.skills.listeners.kept_skills_listener import KeptSkillsListener
from core.modules.skills.listeners.keyword_skills_listener import KeywordSkillsListener
from core.modules.skills.listeners.skill_event_listener import SkillEventListener
from core.modules.skills.listeners.skill_loaded_mark_listener import SkillLoadedMarkListener
from core.modules.skills.listeners.skill_part_read_listener import SkillPartReadListener
from core.modules.skills.listeners.skill_read_listener import SkillReadListener
from core.modules.skills.listeners.skill_request_listener import SkillRequestListener
from core.modules.skills.listeners.skill_request_save_listener import SkillRequestSaveListener
from core.modules.skills.listeners.start_skills_listener import StartSkillsListener
from core.modules.skills.migrations.m001_skills import SkillsTablesMigration
from core.modules.skills.migrations.m002_skill_requests import SkillRequestsTableMigration
from core.modules.skills.commands.record_kept_skills.record_kept_skills_handler import RecordKeptSkillsHandler
from core.modules.skills.seeders.skills_seeder import SkillsSeeder
from core.modules.skills.marks.skill_mark import SkillMark
from core.modules.skills.support.start_skills import SKILL_SETTINGS
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.block_conditions.skills_read import SkillsRead
from core.modules.skills.inspectors.skill_inspector import SkillInspector



from core.modules.skills.commands.profile_skills.profile_skills_subcommand import ProfileSkillsSubcommand
from core.modules.skills.commands.save_profile.save_profile_handler import SaveProfileHandler
from core.modules.skills.commands.save_profile.save_profile_subcommand import SaveProfileSubcommand

class SkillsModule(Module):
    """Publishes skills and tracks what each agent must read."""

    name = "journal.core.skills"
    agent_messages = SKILL_AGENT_MESSAGES
    move_reason = "version 4 kept skills as files, not as a table"
    requires_engine = ">=5,<6"
    block_conditions = [SkillsRead, SkillLoaded]
    settings = SKILL_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.settings", "journal.core.chat", "journal.core.processes", "journal.core.environments", "journal.core.profiles"]
    skills = SKILLS_SKILLS
    models = [AgentSkillModelDeclaration, SkillRequestModelDeclaration]
    migrations = [SkillSessionMigration, SkillsTablesMigration, SkillRequestsTableMigration]
    subcommands = [SaveProfileSubcommand, ProfileSkillsSubcommand, SetRequiredSkillSubcommand, SkillRequirementsSubcommand, SkillWriteSubcommand, SkillListSubcommand, RequireSkillSubcommand, SkillShowSubcommand, AgentSkillUnreadSubcommand, SkillRequiredSubcommand]
    handlers = [SaveProfileHandler, SetRequiredSkillHandler, RequireSkillHandler, LoadSkillHandler, RecordKeptSkillsHandler, ResetSkillsHandler, RequestSkillHandler]
    listeners = [KeptSkillsRecordListener, SkillPublishListener, SkillReadListener, SkillPartReadListener, CommandSkillListener, KeptSkillsListener, CompactionResetListener, StartSkillsListener, SkillEventListener, SkillLoadedMarkListener, KeywordSkillsListener, SkillRequestListener, SkillRequestSaveListener]
    marks = [SkillMark]
    needs = [SkillReadFirstNeeds, CommandSkillNeeds]
    policies = [LoadedSkillPolicy]
    windows = SKILLS_WINDOWS
    inspectors = [SkillInspector]
    seeders = [SkillsSeeder]
