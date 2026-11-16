import hashlib
import re
from collections.abc import Callable

# an address of the import map that names a file the viewer serves, written without a version
MAPPED_ADDRESS = re.compile(rb'"(/(?:viewer|modules/[a-z0-9_.]+)/[A-Za-z0-9_./-]+\.js)"')
VIEWER_PREFIX = b"/viewer/"
MODULES_PREFIX = b"/modules/"
VERSION_CHARACTERS = 16


class VersionedImportMap:
    """The shell page with every file its import map names given a version from that file's content, so a browser
    fetches a rebuilt bundle at a new address instead of keeping the copy it cached under the old one."""

    def __init__(self, viewer_module: str, content_of: Callable[[str, str], bytes]) -> None:
        self.viewer_module, self.content_of = viewer_module, content_of

    def versioned(self, page: bytes) -> bytes:
        return MAPPED_ADDRESS.sub(lambda match: b'"' + self.address_with_version(match.group(1)) + b'"', page)

    def address_with_version(self, address: bytes) -> bytes:
        module, path = self.module_path_pair(address)
        version = hashlib.sha1(self.content_of(module, path)).hexdigest()[:VERSION_CHARACTERS]
        return address + b"?v=" + version.encode()

    def module_path_pair(self, address: bytes) -> tuple[str, str]:
        if address.startswith(VIEWER_PREFIX):
            return self.viewer_module, address.removeprefix(VIEWER_PREFIX).decode()
        module, _, path = address.removeprefix(MODULES_PREFIX).partition(b"/")
        return module.decode(), path.decode()
