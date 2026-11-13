from core.modules.skills.commands.set_required_skill.set_required_skill_handler import SetRequiredSkillHandler
from core.modules.skills.rules.skill_already_loaded_rule import SkillAlreadyLoadedRule
from core.modules.skills.commands.set_required_skill.set_required_skill_subcommand import SetRequiredSkillSubcommand
from core.modules.skills.commands.skill_requirements.skill_requirements_subcommand import SkillRequirementsSubcommand
from core.modules.skills.migrations.m003_skill_session import SkillSessionMigration
from engine.viewer.window_read_search import WindowReadSearch
from engine.skill.skill_declaration import SkillDeclaration
from core.modules.skills.listeners.skill_publish_listener import SkillPublishListener
from core.modules.skills.support.skill_nudges import SKILL_NUDGES
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.skills.commands.agent_skill_unread.agent_skill_unread_subcommand import AgentSkillUnreadSubcommand
from core.modules.skills.commands.load_agent_skill.load_agent_skill import LoadAgentSkill
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
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.skill_request import SkillRequest
from core.modules.skills.rules.command_skill_rule import CommandSkillRule
from core.modules.skills.rules.profile_skill_first_rule import ProfileSkillFirstRule
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from core.modules.skills.rules.unread_skill_stop_rule import UnreadSkillStopRule
from core.modules.skills.seeders.skills_seeder import SkillsSeeder
from core.modules.skills.support.skill_marks import SKILL_MARKS
from core.modules.skills.support.start_skills import SKILL_SETTINGS
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.block_conditions.skills_read import SkillsRead
from core.modules.skills.support.skeletons import SKILLS_SKILLS_SKELETON
from core.modules.skills.support.skill_inspector import SKILL_INSPECTOR


SKILLS_READS = ["agent main", "agent-skill list", "agent-skill show", "skill list", "skill show", "skill requirements", "setting show", "trigger list", "trigger try"]
SKILLS_RUNS = ["skill set-required", "skill require", "agent-skill reset", "trigger make", "trigger edit", "trigger pause", "trigger enable", "trigger strike"]
SKILLS_EVENTS = ["agent_skill.*", "agent.*", "setting.*", "trigger.*"]
SKILLS_KEYS = [WindowKey("catalogue", "skill list", events=["setting.*"]),
    WindowKey("requirements", "skill requirements", events=["setting.*"]),
    WindowKey("main-agent", "agent main", events=["agent.*"]),
    WindowKey("loaded", "agent-skill list --limit 1000", arguments=["agent"], events=["agent_skill.*"], loading=KeyLoading.REQUESTED),
    WindowKey("triggers", "trigger list --skill", events=["trigger.*"]),
    WindowKey("text", "skill show", arguments=["folder"], loading=KeyLoading.REQUESTED),
    WindowKey("agent-skill.*", "agent-skill show {id}", loading=KeyLoading.REQUESTED),
    WindowKey("trial", "trigger try", arguments=["phrases", "sentence", "match-mode"], loading=KeyLoading.REQUESTED)]

from core.modules.skills.commands.profile_skills.profile_skills_subcommand import ProfileSkillsSubcommand
from core.modules.skills.commands.save_profile.save_profile_handler import SaveProfileHandler
from core.modules.skills.commands.save_profile.save_profile_subcommand import SaveProfileSubcommand

class SkillsModule(Module):
    """Publishes skills and tracks what each agent must read."""

    name = "journal.core.skills"
    nudges = SKILL_NUDGES
    move_reason = "version 4 kept skills as files, not as a table"
    requires_core = ">=5,<6"
    block_conditions = [SkillsRead, SkillLoaded]
    settings = SKILL_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.settings", "journal.core.chat", "journal.core.processes", "journal.core.environments", "journal.core.profiles"]
    skills = [SkillDeclaration("journal", "Find your way in the journal: what it is, its basic ideas and which skill to load for what; read it before your first command of every session"),
              SkillDeclaration("journal-etiquette", "Behave in the chat with the user and keep the journal's own mechanics out of it; read it before your first reply of every session, with the journal skill", types=["main"])]
    models = [ModelDeclaration(AgentSkill, commands=[LoadAgentSkill]), ModelDeclaration(SkillRequest, excluded_subcommands=["make", "edit", "show", "list", "delete"])]
    migrations = [SkillSessionMigration, SkillsTablesMigration, SkillRequestsTableMigration]
    subcommands = [SaveProfileSubcommand, ProfileSkillsSubcommand, SetRequiredSkillSubcommand, SkillRequirementsSubcommand, SkillWriteSubcommand, SkillListSubcommand, RequireSkillSubcommand, SkillShowSubcommand, AgentSkillUnreadSubcommand, SkillRequiredSubcommand]
    handlers = [SaveProfileHandler, SetRequiredSkillHandler, RequireSkillHandler, LoadSkillHandler, ResetSkillsHandler, RequestSkillHandler]
    listeners = [SkillPublishListener, SkillReadListener, SkillPartReadListener, CommandSkillListener, KeptSkillsListener, CompactionResetListener, StartSkillsListener, SkillEventListener, SkillLoadedMarkListener, KeywordSkillsListener, SkillRequestListener, SkillRequestSaveListener]
    marks = SKILL_MARKS
    driver_rules = [SkillAlreadyLoadedRule, SkillReadFirstRule, ProfileSkillFirstRule, UnreadSkillStopRule, CommandSkillRule]
    windows = [WindowDeclaration("skills.skills", "Skills", "skills.js", WindowLoading.COMPONENT, skeleton=SKILLS_SKILLS_SKELETON, group="project", place=WindowPlace.PAGE, icon=WindowIcon.SKILL, search=WindowReadSearch("skill list", "Find a skill", ("folder", "description")),
                                 reads=SKILLS_READS, runs=SKILLS_RUNS, events=SKILLS_EVENTS,
                                 keys=SKILLS_KEYS),
               WindowDeclaration("skills.skill-body", "Skill", "skill-body.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.SKILL, skeleton=SKILLS_SKILLS_SKELETON,
                                 reads=SKILLS_READS, runs=SKILLS_RUNS, events=SKILLS_EVENTS, keys=SKILLS_KEYS)]
    inspectors = [SKILL_INSPECTOR]
    seeders = [SkillsSeeder]
