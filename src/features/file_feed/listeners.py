from engine.files import is_image
from events import Fact
from events.file_feed import EditToDiff
from events.files import FileEdited
from receiving import Listener


class SpotEditToDiff(Listener[FileEdited]):
    def listen(self, event: FileEdited) -> list[Fact]:
        return [] if is_image(event.path) else [EditToDiff(before=event.before, after=event.after)]
