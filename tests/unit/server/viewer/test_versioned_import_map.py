import hashlib

from server.viewer.versioned_import_map import VersionedImportMap

PAGE = b'{"imports": {"vue": "/viewer/vendor/vue.js", "@journal/window-kit": "/viewer/kit/window-kit.js", "@journal/setting-components": "/modules/journal.core.setting_components/setting-components.js"}}'
FILES = {("journal.core.viewer", "vendor/vue.js"): b"vue", ("journal.core.viewer", "kit/window-kit.js"): b"kit one",
         ("journal.core.setting_components", "setting-components.js"): b"components"}


def version(content: bytes) -> bytes:
    return hashlib.sha1(content).hexdigest()[:16].encode()


def test_every_mapped_file_gets_the_version_of_its_content():
    page = VersionedImportMap("journal.core.viewer", lambda module, path: FILES[(module, path)]).versioned(PAGE)
    assert b'"/viewer/kit/window-kit.js?v=' + version(b"kit one") + b'"' in page
    assert b'"/modules/journal.core.setting_components/setting-components.js?v=' + version(b"components") + b'"' in page
    assert b'"/viewer/vendor/vue.js?v=' + version(b"vue") + b'"' in page


def test_a_rebuilt_file_is_named_at_a_new_address():
    rebuilt = {**FILES, ("journal.core.viewer", "kit/window-kit.js"): b"kit two"}
    previous = VersionedImportMap("journal.core.viewer", lambda module, path: FILES[(module, path)]).versioned(PAGE)
    after = VersionedImportMap("journal.core.viewer", lambda module, path: rebuilt[(module, path)]).versioned(PAGE)
    assert previous != after and version(b"kit two") in after
