from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.environment_scope import EnvironmentScope
from core.base.scope.scopes import Scopes
from core.modules.suggestions.commands.make_suggestions.make_suggestions import MakeSuggestions
from core.modules.suggestions.models.suggestion import Suggestion
from core.modules.suggestions.support.commandments_package import KEY, TITLE, CommandmentsPackage


class MakeSuggestionsHandler(Handler[MakeSuggestions, int]):
    """Saves the Code Commandments suggestion in the caller's environment when it applies and was never made.
    """

    command = MakeSuggestions

    def __init__(self, package: CommandmentsPackage, queries: Queries, repository: Repository, scopes: Scopes) -> None:
        self.package, self.queries, self.repository, self.scopes = package, queries, repository, scopes

    def handle(self, command: MakeSuggestions, context: Context) -> int:
        if context.environment_id is None or self.is_made() or not self.package.is_offered():
            return 0
        self.repository.save(Suggestion(creator_id=context.actor.id, key=KEY, title=TITLE), context)
        return 1

    def is_made(self) -> bool:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.queries.query(Suggestion).filter(key=KEY).exists()
