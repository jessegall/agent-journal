from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.suggestions.commands.answer_suggestion_handler import AnswerSuggestionHandler
from core.modules.suggestions.commands.answer_suggestion_subcommand import AnswerSuggestionSubcommand
from core.modules.suggestions.commands.make_suggestions_handler import MakeSuggestionsHandler
from core.modules.suggestions.commands.suggestion_list_subcommand import SuggestionListSubcommand
from core.modules.suggestions.listeners.suggestion_mark_listener import SuggestionMarkListener
from core.modules.suggestions.migrations.m001_suggestions import SuggestionsTableMigration
from core.modules.suggestions.models.suggestion import Suggestion
from core.modules.suggestions.rules.suggestion_round_rule import SuggestionRoundRule
from core.modules.suggestions.support.suggestion_marks import SUGGESTION_MARKS
from core.modules.suggestions.upgrade.suggestions_move import SuggestionsMove


class SuggestionsModule(Module):
    """Adds suggestions the journal offers the person once, such as running Code Commandments as a plugin, shown as a
    chat mark the person accepts or declines."""

    name = "journal.core.suggestions"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = [ModelDeclaration(Suggestion, excluded_subcommands=["make", "edit", "list", "delete"])]
    moves = [SuggestionsMove]
    windows = [WindowDeclaration("suggestions.suggestions", "Suggestions", "suggestions.js", WindowLoading.COMPONENT, icon=WindowIcon.BULB, reads=["suggestion list"],
                                 events=["suggestion.*"])]
    migrations = [SuggestionsTableMigration]
    handlers = [MakeSuggestionsHandler, AnswerSuggestionHandler]
    subcommands = (SuggestionListSubcommand, AnswerSuggestionSubcommand)
    driver_rules = [SuggestionRoundRule]
    marks = SUGGESTION_MARKS
    listeners = [SuggestionMarkListener]
