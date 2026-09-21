from pathlib import Path
from types import SimpleNamespace

import pytest

import features
from controllers.types import Messages
from features.video import feature
from resources.base import USER
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_clip_length_decides_the_sampling_spacing():
    assert feature.spacing(12) == 0.5, "short clips are sampled twice a second"
    assert feature.spacing(90) == 2, "medium clips are sampled every two seconds"
    assert feature.spacing(600) == 10, "long clips stay under sixty frames"


def test_an_attached_video_is_sampled_into_frames_the_agent_can_inspect(tmp_path):
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
    try:
        record = fresh()
        messages = Messages(record, actor=USER)
        message = messages.create("look at this clip")
        source = tmp_path / "walkthrough.mp4"
        source.write_bytes(b"video")
        messages.attach(message.n, str(source))
        row = messages.load(message.n)
        assert row.files == {
            "walkthrough.mp4": "video; 2 frames every 0.5 seconds",
            "walkthrough-mp4-frame-0001.jpg": "video frame from walkthrough.mp4",
            "walkthrough-mp4-frame-0002.jpg": "video frame from walkthrough.mp4",
        }, "the video points the agent at its sampled frames"
        assert [command[0] for command in called] == ["ffprobe", "ffmpeg"], "ffprobe and ffmpeg each run once"
        assert called[1][called[1].index("-frames:v") + 1] == str(feature.MAX_FRAMES), "ffmpeg caps the number of frames"
    finally:
        feature.subprocess.run = run
        feature.shutil.which = which
