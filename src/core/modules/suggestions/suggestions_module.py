from core.modules.suggestions.windows.suggestions_windows import SUGGESTIONS_WINDOWS
from core.modules.suggestions.models.declarations.suggestion_model_declaration import SuggestionModelDeclaration
from engine.module.module import Module
from core.modules.suggestions.commands.answer_suggestion.answer_suggestion_handler import AnswerSuggestionHandler
from core.modules.suggestions.commands.answer_suggestion.answer_suggestion_subcommand import AnswerSuggestionSubcommand
from core.modules.suggestions.commands.suggestion_list.suggestion_list_subcommand import SuggestionListSubcommand
from core.modules.suggestions.listeners.suggestion_mark_listener import SuggestionMarkListener
from core.modules.suggestions.migrations.m001_suggestions import SuggestionsTableMigration
from core.modules.suggestions.migrations.m002_open_suggestion_index import OpenSuggestionIndexMigration
from core.modules.suggestions.migrations.m003_environment_suggestion_index import EnvironmentSuggestionIndexMigration
from core.modules.suggestions.support.suggestion_marks import SUGGESTION_MARKS
from core.modules.suggestions.upgrade.suggestions_move import SuggestionsMove


class SuggestionsModule(Module):
    """Adds suggestions the journal offers the user once,
    shown as a chat mark the user accepts or declines."""

    name = "journal.core.suggestions"
    seed_reason = "a suggestion is an agent's own offer, which a demo has none of"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = [SuggestionModelDeclaration]
    moves = [SuggestionsMove]
    windows = SUGGESTIONS_WINDOWS
    migrations = [SuggestionsTableMigration, OpenSuggestionIndexMigration, EnvironmentSuggestionIndexMigration]
    handlers = [AnswerSuggestionHandler]
    subcommands = [SuggestionListSubcommand, AnswerSuggestionSubcommand]
    marks = SUGGESTION_MARKS
    listeners = [SuggestionMarkListener]
