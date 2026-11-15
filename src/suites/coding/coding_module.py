from suites.coding.support.coding_module_nudges import CODING_MODULE_NUDGES
from suites.coding.seeders.coding_seeders import CODING_SEEDERS
from suites.coding.settings.coding_setting_lists import CODING_SETTING_LISTS
from suites.coding.upgrade.coding_moves import CODING_MOVES
from suites.coding.drivers.coding_drivers import CODING_DRIVERS
from suites.coding.drivers.helper.merger_agent_driver import MergerAgentDriver
from suites.coding.drivers.main.coding_main_agent_driver import CodingMainAgentDriver
from suites.coding.drivers.worker.worker_agent_driver import WorkerAgentDriver
from suites.coding.models.coding_models import CODING_MODELS
from suites.coding.migrations.coding_migrations import CODING_MIGRATIONS
from suites.coding.commands.coding_handlers import CODING_HANDLERS
from suites.coding.rules.coding_driver_rules import CODING_DRIVER_RULES
from suites.coding.listeners.coding_listeners import CODING_LISTENERS
from suites.coding.commands.coding_subcommands import CODING_SUBCOMMANDS
from suites.coding.agent_groups.coding_agent_groups import CODING_AGENT_GROUPS
from suites.coding.skills.declarations.coding_skills import CODING_SKILLS
from suites.coding.windows.extensions.coding_window_extensions import CODING_WINDOW_EXTENSIONS
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from suites.coding.templates.coding_templates import CODING_TEMPLATES
from engine.module.module import Module
from suites.coding.bindings.coding_tool_runners import CodingToolRunners
from core.modules.tools.support.tool_runners import ToolRunners
from suites.coding.windows.coding_windows import CODING_WINDOWS
from engine.checkout.project_checkouts import ProjectCheckouts
from suites.coding.support.worktree_checkouts import WorktreeCheckouts



class CodingModule(Module):
    """Ships the coding suite with its drivers, the record of every file a coding agent edits, and its
    windows; the modules only coding uses live in its modules folder."""

    name = "journal.suites.coding"
    profiles = HELPER_PROFILES
    agent_groups = CODING_AGENT_GROUPS
    templates = CODING_TEMPLATES
    nudges = CODING_MODULE_NUDGES
    seeders = CODING_SEEDERS
    window_extensions = CODING_WINDOW_EXTENSIONS
    requires_engine = ">=5,<6"
    settings = CODING_SETTING_LISTS
    moves = CODING_MOVES
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.assignments", "journal.core.assign_rules", "journal.core.plans", "journal.core.settings", "journal.core.setting-requests", "journal.core.viewer", "journal.core.plugins", "journal.core.processes", "journal.core.messages", "journal.core.questions", "journal.core.helpers", "journal.core.tools", "journal.core.developer", "journal.core.documents", "journal.core.dumps", "journal.core.library", "journal.core.mcp", "journal.core.memories", "journal.core.profiles", "journal.core.project-rules", "journal.core.reminders", "journal.core.schedules", "journal.core.search", "journal.core.secrets", "journal.core.sequences", "journal.core.sharing", "journal.core.skills", "journal.core.templates", "journal.core.transcriptions", "journal.core.triggers", "journal.core.tunnel", "journal.core.updates", "journal.core.usage"]
    drivers = CODING_DRIVERS
    agent_drivers = [CodingMainAgentDriver, WorkerAgentDriver, MergerAgentDriver]
    skills = CODING_SKILLS
    models = CODING_MODELS
    migrations = CODING_MIGRATIONS
    handlers = CODING_HANDLERS
    driver_rules = CODING_DRIVER_RULES
    listeners = CODING_LISTENERS
    bindings = {ToolRunners: CodingToolRunners, ProjectCheckouts: WorktreeCheckouts}
    subcommands = CODING_SUBCOMMANDS
    windows = CODING_WINDOWS
