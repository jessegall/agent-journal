from dataclasses import replace

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.viewer.viewer_layout import ViewerLayout
from core.modules.viewer.viewer_layout_save import ViewerLayoutSave


class ViewerLayoutSaveHandler(Handler[ViewerLayoutSave, ViewerLayout]):
    """Writes the person's one layout row for the page, suite and driver in the environment: its layout anew, or a
    new row; only a person keeps a layout."""

    command = ViewerLayoutSave

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ViewerLayoutSave, context: Context) -> ViewerLayout:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person keeps a layout", "the viewer saves a layout when the person arranges a page")
        if context.environment_id is None:
            raise Refusal("a layout belongs to an environment", "name one with --environment")
        rows = self.queries.query(ViewerLayout).filter(environment_id=context.environment_id, person_id=context.actor.id, suite=command.suite,
                                                       page=command.page, driver=command.driver).page(1, 1).rows
        if rows:
            return self.repository.save(replace(rows[0], layout=command.layout), context)
        return self.repository.save(ViewerLayout(environment_id=context.environment_id, person_id=context.actor.id, creator_id=context.actor.id,
                                                 suite=command.suite, page=command.page, driver=command.driver, layout=command.layout), context)
