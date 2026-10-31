from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.suggestions.commands.make_suggestions import MakeSuggestions
from core.modules.suggestions.models.suggestion import Suggestion
from core.modules.suggestions.support.commandments_package import KEY, TITLE, CommandmentsPackage


class MakeSuggestionsHandler(Handler[MakeSuggestions, int]):
    """Saves the Code Commandments suggestion in the caller's environment when it applies and was never made."""

    command = MakeSuggestions

    def __init__(self, package: CommandmentsPackage, queries: Queries, repository: Repository) -> None:
        self.package, self.queries, self.repository = package, queries, repository

    def handle(self, command: MakeSuggestions, context: Context) -> int:
        if context.environment_id is None or self.queries.query(Suggestion).filter(key=KEY).exists() or not self.package.is_offered():
            return 0
        self.repository.save(Suggestion(environment_id=context.environment_id, creator_id=context.actor.id, key=KEY, title=TITLE), context)
        return 1
