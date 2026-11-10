from engine.event.touched import Touched
from engine.listener.commit_listener import CommitListener


# @righteous architecture_listeners_every_model
class TaskChangeListener(CommitListener[Touched[Task]]):
    def handle(self, event, logged):
        # @sin architecture_listeners_file_read
        text = self.path.read_text()
        # @sin architecture_listeners_file_read
        paths = self.path.glob("*.md")
        # @sin architecture_listeners_file_read
        entries = self.catalogue.plugin_skills()
        # @sin architecture_listeners_row_loaded_from_an_event
        row = self.tasks.filter(id=logged.row_id)
        # @sin architecture_listeners_row_loaded_from_an_event
        task = self.rows.find(Task, logged.row_id)
        # @righteous architecture_listeners_row_loaded_from_an_event
        related = self.tasks.filter(parent_id=logged.row_id)
        # @righteous architecture_listeners_row_loaded_from_an_event
        current = event.row


def read_folder(path):
    # @righteous architecture_listeners_file_read
    return path.read_text()
