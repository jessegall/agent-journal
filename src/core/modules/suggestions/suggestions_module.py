from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_search import WindowSearch
from core.modules.suggestions.support.suggestion_searcher import SuggestionSearcher
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.suggestions.commands.answer_suggestion.answer_suggestion_handler import AnswerSuggestionHandler
from core.modules.suggestions.commands.answer_suggestion.answer_suggestion_subcommand import AnswerSuggestionSubcommand
from core.modules.suggestions.commands.suggestion_list.suggestion_list_subcommand import SuggestionListSubcommand
from core.modules.suggestions.listeners.suggestion_mark_listener import SuggestionMarkListener
from core.modules.suggestions.migrations.m001_suggestions import SuggestionsTableMigration
from core.modules.suggestions.migrations.m002_open_suggestion_index import OpenSuggestionIndexMigration
from core.modules.suggestions.migrations.m003_environment_suggestion_index import EnvironmentSuggestionIndexMigration
from core.modules.suggestions.models.suggestion import Suggestion
from core.modules.suggestions.support.suggestion_marks import SUGGESTION_MARKS
from core.modules.suggestions.upgrade.suggestions_move import SuggestionsMove
from core.modules.suggestions.support.skeletons import SUGGESTIONS_SUGGESTIONS_SKELETON


class SuggestionsModule(Module):
    """Adds suggestions the journal offers the user once,
    shown as a chat mark the user accepts or declines."""

    name = "journal.core.suggestions"
    seed_reason = "a suggestion is an agent's own offer, which a demo has none of"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = [ModelDeclaration(Suggestion, excluded_subcommands=["make", "edit", "list", "delete"])]
    moves = [SuggestionsMove]
    windows = [WindowDeclaration("suggestions.suggestions", "Suggestions", "suggestions.js", WindowLoading.COMPONENT, skeleton=SUGGESTIONS_SUGGESTIONS_SKELETON, search=WindowSearch(SuggestionSearcher, "Search the suggestions"), icon=WindowIcon.BULB, reads=["suggestion list"],
                                 events=["suggestion.*"], keys=[WindowKey("suggestions", "suggestion list", events=["suggestion.*"])])]
    migrations = [SuggestionsTableMigration, OpenSuggestionIndexMigration, EnvironmentSuggestionIndexMigration]
    handlers = [AnswerSuggestionHandler]
    subcommands = [SuggestionListSubcommand, AnswerSuggestionSubcommand]
    marks = SUGGESTION_MARKS
    listeners = [SuggestionMarkListener]
