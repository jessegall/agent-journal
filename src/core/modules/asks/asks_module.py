from engine.module.ask_facts import AskFacts
from engine.module.ask_topic import AskTopic
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.asks.migrations.m001_asks import AsksTablesMigration
from core.modules.asks.migrations.m002_ask_stacks import AskStacksTableMigration
from core.modules.asks.models.ask_stack import AskStack
from core.modules.asks.models.ask import Ask
from core.modules.asks.models.ask_step import AskStep
from core.modules.asks.queries.ask_query import AskQuery
from core.modules.asks.commands.approve_ask_stack.approve_ask_stack_handler import ApproveAskStackHandler
from core.modules.asks.commands.approve_ask_stack.approve_ask_stack_subcommand import ApproveAskStackSubcommand
from core.modules.asks.commands.end_replaced_ask_stacks.end_replaced_ask_stacks_handler import EndReplacedAskStacksHandler
from core.modules.asks.guards.agent_stack_guard import AgentStackGuard
from core.modules.asks.guards.question_times_guard import QuestionTimesGuard
from core.modules.asks.migrations.m003_ask_setting_keys import AskSettingKeysMigration
from core.modules.asks.support.ask_settings import ASK_SETTINGS
from core.modules.asks.listeners.ask_stack_listener import AskStackListener
from core.modules.asks.support.helper_ask_facts import HelperAskFacts

# the journal ask command makes a question (task 9815), so the built make, edit and delete are left out
BUILT = ["make", "edit", "delete"]


class AsksModule(Module):
    """Adds questions a helper asks its parent, which go up a stack of levels set per topic before they reach the
    parent."""

    name = "journal.core.asks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.settings", "journal.core.tasks"]
    models = [ModelDeclaration(Ask, query=AskQuery, excluded_subcommands=BUILT), ModelDeclaration(AskStep, excluded_subcommands=BUILT), ModelDeclaration(AskStack, excluded_subcommands=BUILT)]
    migrations = [AsksTablesMigration, AskStacksTableMigration, AskSettingKeysMigration]
    settings = ASK_SETTINGS
    ask_topics = [AskTopic("general", "go on with anything the task still holds, or stop")]
    bindings = {AskFacts: HelperAskFacts}
    guards = [AgentStackGuard, QuestionTimesGuard]
    handlers = [ApproveAskStackHandler, EndReplacedAskStacksHandler]
    subcommands = [ApproveAskStackSubcommand]
    listeners = [AskStackListener]
