from events import Fact
from events.open_viewer import ViewerTabToOpen
from receiving import Handler
from serving import Elsewhere, Viewer


class ShowViewerTab(Handler[ViewerTabToOpen]):
    def handle(self, event: ViewerTabToOpen, viewer: Viewer, elsewhere: Elsewhere) -> list[Fact]:
        viewer.show(event.url, elsewhere.here().name)
        return []
