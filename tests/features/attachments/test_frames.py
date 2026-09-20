import sys
import tempfile
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Messages  # noqa: E402
from features.attachments import feature  # noqa: E402
from resources.base import USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

check("short clips are sampled twice a second", feature.spacing(12), 0.5)
check("medium clips are sampled every two seconds", feature.spacing(90), 2)
check("long clips stay under sixty frames", feature.spacing(600), 10)

called = []
run = feature.subprocess.run
which = feature.shutil.which


def fake_run(command, **kwargs):
    called.append(command)
    if command[0] == "ffprobe":
        return SimpleNamespace(returncode=0, stdout="12.0\n", stderr="")
    pattern = Path(command[-1])
    for n in (1, 2):
        Path(str(pattern).replace("%04d", f"{n:04d}")).write_bytes(b"jpg")
    return SimpleNamespace(returncode=0, stdout="", stderr="")


feature.subprocess.run = fake_run
feature.shutil.which = lambda name: f"/usr/bin/{name}"
record = fresh()
messages = Messages(record, actor=USER)
message = messages.create("look at this clip")
source = Path(tempfile.mkdtemp()) / "walkthrough.mp4"
source.write_bytes(b"video")
messages.attach(message.n, str(source))
row = messages.load(message.n)
check("the video points the agent at its sampled frames", row.files, {
    "walkthrough.mp4": "video; 2 frames every 0.5 seconds",
    "walkthrough-mp4-frame-0001.jpg": "video frame from walkthrough.mp4",
    "walkthrough-mp4-frame-0002.jpg": "video frame from walkthrough.mp4",
})
check("ffprobe and ffmpeg each run once", [command[0] for command in called], ["ffprobe", "ffmpeg"])
check("ffmpeg caps the number of frames", called[1][called[1].index("-frames:v") + 1], str(feature.MAX_FRAMES))

feature.subprocess.run = run
feature.shutil.which = which

done()
