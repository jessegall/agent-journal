from core.modules.asks.models.declarations.ask_model_declaration import AskModelDeclaration
from core.modules.asks.models.declarations.ask_step_model_declaration import AskStepModelDeclaration
from core.modules.asks.models.declarations.ask_stack_model_declaration import AskStackModelDeclaration
from engine.module.ask_facts import AskFacts
from core.modules.asks.ask_topics.general_ask_topic import GeneralAskTopic
from engine.module.module import Module
from core.modules.asks.migrations.m001_asks import AsksTablesMigration
from core.modules.asks.migrations.m002_ask_stacks import AskStacksTableMigration
from core.modules.asks.commands.approve_ask_stack.approve_ask_stack_handler import ApproveAskStackHandler
from core.modules.asks.commands.approve_ask_stack.approve_ask_stack_subcommand import ApproveAskStackSubcommand
from core.modules.asks.commands.end_replaced_ask_stacks.end_replaced_ask_stacks_handler import EndReplacedAskStacksHandler
from core.modules.asks.guards.ask_stack_approval_guard import AskStackApprovalGuard
from core.modules.asks.guards.question_times_guard import QuestionTimesGuard
from core.modules.asks.migrations.m003_ask_setting_keys import AskSettingKeysMigration
from core.modules.asks.migrations.m004_environment_indexes import AsksEnvironmentIndexesMigration
from core.modules.asks.migrations.m005_plain_field_names import AsksPlainFieldNamesMigration
from core.modules.asks.support.ask_settings import QUESTION_SETTINGS
from core.modules.asks.listeners.ask_stack_listener import AskStackListener
from core.modules.asks.support.helper_ask_facts import HelperAskFacts



class AsksModule(Module):
    """Adds questions a helper asks its parent, which go up a stack of levels set per topic before they reach the
    parent."""

    name = "journal.core.asks"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.settings", "journal.core.tasks"]
    models = [AskModelDeclaration, AskStepModelDeclaration, AskStackModelDeclaration]
    migrations = [AsksTablesMigration, AskStacksTableMigration, AskSettingKeysMigration, AsksEnvironmentIndexesMigration, AsksPlainFieldNamesMigration]
    settings = QUESTION_SETTINGS
    helper_question_topics = [GeneralAskTopic]
    move_reason = "version 4 had no questions a helper asks its parent"
    seed_reason = "a helper's question to its parent lives only while the helper runs, and the demo runs no helper"
    bindings = {AskFacts: HelperAskFacts}
    guards = [AskStackApprovalGuard, QuestionTimesGuard]
    handlers = [ApproveAskStackHandler, EndReplacedAskStacksHandler]
    subcommands = [ApproveAskStackSubcommand]
    listeners = [AskStackListener]
