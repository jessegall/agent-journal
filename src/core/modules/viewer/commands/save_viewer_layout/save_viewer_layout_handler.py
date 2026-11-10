from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.commands.save_viewer_layout.save_viewer_layout import SaveViewerLayout
from core.modules.agents.support.person_check import PersonCheck


class SaveViewerLayoutHandler(Handler[SaveViewerLayout, ViewerLayout]):
    """Writes the person's one layout row for the page, suite and driver in the environment, over the row
    there is or as a new one, refusing a save over a version newer than the one it was loaded at; the guard
    viewer.person-keeps-layouts refuses any caller but a person."""

    command = SaveViewerLayout

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: SaveViewerLayout, context: Context) -> ViewerLayout:
        if context.environment_id is None:
            raise Refusal("a layout belongs to an environment", "name one with --environment")
        PersonCheck.require(context, f"Save the layout for {command.page}?")
        saved = self.queries.query(ViewerLayout).filter(person_id=context.actor.id, suite=command.suite,
                                                       page=command.page, driver=command.driver).first()
        if saved is not None and saved.has_changed_after(command.base_version):
            raise Refusal(f"the layout was saved again since version {command.base_version}; it is at version {saved.version}",
                          f"journal viewer-layout current --suite {command.suite} --page {command.page} reads it")
        layout = ViewerLayout(person_id=context.actor.id, creator_id=context.actor.id, suite=command.suite,
                              page=command.page, driver=command.driver, layout=command.layout)
        return self.repository.merge(saved, layout, context)
