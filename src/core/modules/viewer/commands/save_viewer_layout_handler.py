from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.commands.save_viewer_layout import SaveViewerLayout


class SaveViewerLayoutHandler(Handler[SaveViewerLayout, ViewerLayout]):
    """Writes the person's one layout row for the page, suite and driver in the environment, over the row there
    is or as a new one; the guard viewer.person-keeps-layouts refuses any caller but a person."""

    command = SaveViewerLayout

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: SaveViewerLayout, context: Context) -> ViewerLayout:
        if context.environment_id is None:
            raise Refusal("a layout belongs to an environment", "name one with --environment")
        rows = self.queries.query(ViewerLayout).filter(environment_id=context.environment_id, person_id=context.actor.id, suite=command.suite,
                                                       page=command.page, driver=command.driver).page(1, 1).rows
        layout = ViewerLayout(environment_id=context.environment_id, person_id=context.actor.id, creator_id=context.actor.id, suite=command.suite,
                              page=command.page, driver=command.driver, layout=command.layout)
        return self.repository.merge(rows[0] if rows else None, layout, context)
