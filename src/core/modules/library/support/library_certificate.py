from engine.file.file_access import FileAccess
import ssl
import urllib.request
from pathlib import Path

from engine.private.private_folder import PrivateFolder
from core.modules.library.support.no_redirects import NoRedirects

SUFFIX = ".library-certificate.pem"


class LibraryCertificate:
    """The certificate a user trusted for the shared server, kept in the private folder beside the token, and the
    openers that follow no redirect and trust it, or the system's certificates when none is kept."""

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder

    def opener(self) -> urllib.request.OpenerDirector:
        path = self.folder.file(SUFFIX)
        return self.trusting(path) if path is not None and FileAccess.is_file(path) else urllib.request.build_opener(NoRedirects)

    @staticmethod
    def trusting(file: Path) -> urllib.request.OpenerDirector:
        context = ssl.create_default_context(cafile=str(file))
        return urllib.request.build_opener(NoRedirects, urllib.request.HTTPSHandler(context=context))

    def keep(self, file: Path) -> None:
        kept = self.folder.made_file(SUFFIX)
        FileAccess.write(kept, FileAccess.read(file))
        FileAccess.chmod(kept, 0o600)

    def remove(self) -> None:
        path = self.folder.file(SUFFIX)
        if path is not None:
            FileAccess.unlink(path, missing_ok=True)
