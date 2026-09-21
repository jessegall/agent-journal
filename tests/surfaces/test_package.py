import io
import zipfile

import pytest

import features
from commands.http import dispatch
from surfaces.package import archive, info
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_the_extension_is_advertised_and_served_as_a_zip():
    record = fresh()
    assert info()["available"] is True, "the package advertises the extension"

    names = zipfile.ZipFile(io.BytesIO(archive())).namelist()
    assert "manifest.json" in names, "the zip has Chrome's manifest at its root"
    assert all(name in names for name in ("chat.js", "picker.js", "bridge.js", "background.js")), \
        "the zip carries the window, picker and bridge"

    reply = dispatch("GET", "/extension.zip", record.root, {}, {})
    assert (reply.code, reply.kind, zipfile.is_zipfile(io.BytesIO(reply.body))) == (200, "application/zip", True), \
        "the viewer serves the extension zip"
    assert dispatch("GET", "/api/extension", record.root, {}, {}).body["available"] is True, \
        "the viewer describes the extension"
