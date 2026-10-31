from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.skills.commands.agent_skill_unread_subcommand import AgentSkillUnreadSubcommand
from core.modules.skills.commands.load_agent_skill import LoadAgentSkill
from core.modules.skills.commands.load_skill_handler import LoadSkillHandler
from core.modules.skills.commands.request_skill_handler import RequestSkillHandler
from core.modules.skills.commands.require_skill_handler import RequireSkillHandler
from core.modules.skills.commands.require_skill_subcommand import RequireSkillSubcommand
from core.modules.skills.commands.reset_skills_handler import ResetSkillsHandler
from core.modules.skills.commands.skill_list_subcommand import SkillListSubcommand
from core.modules.skills.commands.skill_show_subcommand import SkillShowSubcommand
from core.modules.skills.commands.skill_write_subcommand import SkillWriteSubcommand
from core.modules.skills.listeners.compaction_reset_listener import CompactionResetListener
from core.modules.skills.listeners.keyword_skills_listener import KeywordSkillsListener
from core.modules.skills.listeners.skill_event_listener import SkillEventListener
from core.modules.skills.listeners.skill_loaded_mark_listener import SkillLoadedMarkListener
from core.modules.skills.listeners.skill_read_listener import SkillReadListener
from core.modules.skills.listeners.skill_request_listener import SkillRequestListener
from core.modules.skills.listeners.start_skills_listener import StartSkillsListener
from core.modules.skills.migrations.m001_skills import SkillsTablesMigration
from core.modules.skills.migrations.m002_skill_requests import SkillRequestsTableMigration
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.skill_request import SkillRequest
from core.modules.skills.rules.command_skill_rule import CommandSkillRule
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from core.modules.skills.rules.unread_skill_stop_rule import UnreadSkillStopRule
from core.modules.skills.seeders.skills_seeder import SkillsSeeder
from core.modules.skills.support.skill_marks import SKILL_MARKS
from core.modules.skills.support.start_skills import SKILL_SETTINGS


class SkillsModule(Module):
    """Adds the skills the modules declare: a list of them, and a write of their texts into the skill folders of
    the agent programs."""

    name = "journal.core.skills"
    requires_core = ">=5,<6"
    settings = SKILL_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.settings", "journal.core.chat"]
    models = [ModelDeclaration(AgentSkill, commands=[LoadAgentSkill]), ModelDeclaration(SkillRequest, excluded_subcommands=["make", "edit", "show", "list", "delete"])]
    migrations = [SkillsTablesMigration, SkillRequestsTableMigration]
    subcommands = [SkillWriteSubcommand, SkillListSubcommand, RequireSkillSubcommand, SkillShowSubcommand, AgentSkillUnreadSubcommand]
    handlers = [RequireSkillHandler, LoadSkillHandler, ResetSkillsHandler, RequestSkillHandler]
    listeners = [SkillReadListener, CompactionResetListener, StartSkillsListener, SkillEventListener, SkillLoadedMarkListener, KeywordSkillsListener, SkillRequestListener]
    marks = SKILL_MARKS
    driver_rules = [SkillReadFirstRule, UnreadSkillStopRule, CommandSkillRule]
    windows = [WindowDeclaration("skills.skills", "Skills", "skills.js", WindowLoading.COMPONENT, place=WindowPlace.AGENT, icon=WindowIcon.SKILL,
                                 reads=["agent-skill list", "skill list", "skill show"], events=["agent_skill.*"])]
    seeders = [SkillsSeeder]
