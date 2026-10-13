from events import Fact
from events.file_feed import EditToDiff
from events.files import FileEdited
from receiving import Listener
from resources.files import is_image


class SpotEditToDiff(Listener[FileEdited]):
    def listen(self, event: FileEdited) -> list[Fact]:
        return [] if is_image(event.path) else [EditToDiff(before=event.before, after=event.after)]
