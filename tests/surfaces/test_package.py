import io
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import features  # noqa: E402
from commands.http import dispatch  # noqa: E402
from surfaces.package import archive, info  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
check("the package advertises the extension", info()["available"], True)

names = zipfile.ZipFile(io.BytesIO(archive())).namelist()
check("the zip has Chrome's manifest at its root", "manifest.json" in names, True)
check("the zip carries the window, picker and bridge", all(name in names for name in ("chat.js", "picker.js", "bridge.js", "background.js")), True)

reply = dispatch("GET", "/extension.zip", record.root, {}, {})
check("the viewer serves the extension zip", (reply.code, reply.kind, zipfile.is_zipfile(io.BytesIO(reply.body))), (200, "application/zip", True))
check("the viewer describes the extension", dispatch("GET", "/api/extension", record.root, {}, {}).body["available"], True)

done()
