from core.base.skill.skill_declaration import SkillDeclaration
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.template.template_declaration import TemplateDeclaration
from core.base.viewer.window_search import WindowSearch
from core.base.viewer.button_declaration import ButtonCondition, ButtonDeclaration, Choice, ChoiceField, TemplateField
from core.base.viewer.window_extension import WindowExtension
from core.modules.templates.support.template_searcher import TemplateSearcher
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.templates.commands.make_template.make_template_handler import MakeTemplateHandler
from core.modules.templates.commands.make_template.make_template_subcommand import MakeTemplateSubcommand
from core.modules.templates.commands.template_list.template_list_subcommand import TemplateListSubcommand
from core.modules.templates.commands.template_show.template_show_subcommand import TemplateShowSubcommand
from core.modules.templates.commands.save_standard_templates.save_standard_templates_handler import SaveStandardTemplatesHandler
from core.modules.templates.guards.standard_template_guard import StandardTemplateGuard
from core.modules.templates.listeners.critique_report_listener import CritiqueReportListener
from core.modules.templates.listeners.standard_templates_listener import StandardTemplatesListener
from core.modules.templates.support.review_state import REVIEW_STATE
from core.modules.templates.migrations.m001_templates import TemplatesTableMigration
from core.modules.templates.migrations.m002_template_module import TemplateModuleColumnMigration
from core.modules.templates.models.template import Template
from core.modules.templates.queries.template_query import TemplateQuery
from core.modules.templates.commands.send_template.send_template_handler import SendTemplateHandler
from core.modules.templates.commands.send_template.send_template_subcommand import SendTemplateSubcommand
from core.modules.templates.seeders.templates_seeder import TemplatesSeeder
from core.modules.templates.upgrade.templates_move import TemplatesMove
from core.modules.templates.support.skeletons import TEMPLATES_TEMPLATES_SKELETON


class TemplatesModule(Module):
    """Adds templates: reusable shapes for tasks, plans and critiques, and the testing template a plan runs
    at each phase end."""

    name = "journal.core.templates"
    templates = [TemplateDeclaration(title="General critique", targets=tuple(["plan"]), purpose="critique",
                                     brief="Read it as a whole and say what you would change, and why.")]
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.drivers", "journal.core.messages", "journal.core.documents", "journal.core.plans", "journal.core.agents", "journal.core.skills"]
    skills = [SkillDeclaration("journal-templates", "Find and use a template for a task, a plan or a review; read it before the first template command of a session", keywords=("template", "templates"), commands=["template"])]
    models = [ModelDeclaration(Template, query=TemplateQuery, excluded_subcommands=["make", "edit", "show", "list"])]
    migrations = [TemplatesTableMigration, TemplateModuleColumnMigration]
    moves = [TemplatesMove]
    handlers = [MakeTemplateHandler, SaveStandardTemplatesHandler, SendTemplateHandler]
    subcommands = [MakeTemplateSubcommand, TemplateShowSubcommand, TemplateListSubcommand, SendTemplateSubcommand]
    listeners = [StandardTemplatesListener, CritiqueReportListener]
    added_states = tuple([REVIEW_STATE])
    guards = [StandardTemplateGuard]
    seeders = [TemplatesSeeder]
    window_extensions = [WindowExtension("messages.chat", reads=["template list"])]
    buttons = [ButtonDeclaration("templates.critique", ("dock.plans.waiting", "row.plan"), "Ask for a critique",
                                 "template send {template} --on=plan:{row_id} --set=agents={agents} --set=size={size}",
                                 condition=ButtonCondition("state", tuple(["ready"])), tip="Reviewers read it before you approve",
                                 fields=(ChoiceField("agents", "How many agents", tuple(Choice("one agent" if count == 1 else f"{count} agents", str(count)) for count in range(1, 6)), "2 agents"),
                                         ChoiceField("size", "How thorough", tuple(Choice(size, size) for size in ("a quick look", "a normal read", "a thorough review")), "a normal read"),
                                         TemplateField("template", "Template", "plan", "critique", "General critique"))),
               ButtonDeclaration("templates.end-review", ("dock.plans.waiting", "row.plan"), "End the review", "plan reviewed {row_id}",
                                 condition=ButtonCondition("state", tuple(["reviewing"])), tip="The plan is ready again")]
    windows = [WindowDeclaration("templates.templates", "Templates", "templates.js", WindowLoading.COMPONENT, skeleton=TEMPLATES_TEMPLATES_SKELETON, search=WindowSearch(TemplateSearcher, "Search the templates"), group="project", icon=WindowIcon.FILED,
                                 reads=["template list", "template show"], events=["template.*"])]
