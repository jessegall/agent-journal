from engine.file.file_access import FileAccess
import ssl
import urllib.request
from pathlib import Path

from core.base.private.private_folder import PrivateFolder
from core.modules.library.support.no_redirects import NoRedirects

SUFFIX = ".library-certificate.pem"


class LibraryCertificate:
    """The certificate a person trusted for the shared server, kept in the private folder beside the token, and the
    openers that follow no redirect and trust it, or the system's certificates when none is kept."""

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder

    def opener(self) -> urllib.request.OpenerDirector:
        path = self.folder.file(SUFFIX)
        return self.trusting(path) if path is not None and path.is_file() else urllib.request.build_opener(NoRedirects)

    @staticmethod
    def trusting(file: Path) -> urllib.request.OpenerDirector:
        context = ssl.create_default_context(cafile=str(file))
        return urllib.request.build_opener(NoRedirects, urllib.request.HTTPSHandler(context=context))

    def keep(self, file: Path) -> None:
        kept = self.folder.made_file(SUFFIX)
        FileAccess.shared().write(kept, FileAccess.shared().read(file))
        kept.chmod(0o600)

    def remove(self) -> None:
        path = self.folder.file(SUFFIX)
        if path is not None:
            path.unlink(missing_ok=True)
