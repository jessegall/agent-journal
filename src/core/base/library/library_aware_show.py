from argparse import Namespace
from typing import ClassVar, Generic, TypeVar

from core.base.caller.caller import Caller
from core.base.library.library_lookup import LibraryLookup
from core.base.library.library_reading import LibraryReading
from core.base.library.library_ref import LibraryRef
from core.base.refusal import Refusal


L = TypeVar("L")


class LibraryAwareShow(Generic[L]):
    """What a show command of a shared type adds to reading its own rows: an item of the team's library read live
    by its library number, and, when a plain number names no row here, the library item with that number. The
    command gives its own reading of a row in `local`."""

    share: ClassVar[str]
    cli_name: str
    lookup: LibraryLookup

    def local(self, arguments: Namespace, caller: Caller) -> L:
        raise NotImplementedError

    def read(self, arguments: Namespace, caller: Caller) -> L | LibraryReading:
        if isinstance(arguments.id, LibraryRef):
            return self.library_reading(arguments)
        try:
            return self.local(arguments, caller)
        except Refusal as missing:
            title = self.lookup.title(self.share, arguments.id)
            if title is None:
                raise
            raise Refusal(missing.reason, f"library {self.share} {arguments.id} exists: {title}; read it with journal {self.cli_name} show library:{arguments.id}") from missing

    def library_reading(self, arguments: Namespace) -> LibraryReading:
        item = self.lookup.item(self.share, arguments.id)
        if item is None:
            raise Refusal("this journal has no library to read", "journal library connect connects it to a shared server")
        return LibraryReading(item, arguments)
