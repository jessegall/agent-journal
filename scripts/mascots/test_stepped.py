"""The browser drawing in stepped/ uses the same numbers as the Blender scripts it copies: the look, the camera and the clips."""
import ast
import re
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
PAGE = (HERE / "stepped" / "figure.js").read_text()

# the shade step on N.L that toon.py's ramp gives: a 0.8 grey Diffuse BSDF reads 0.8 N.L under a sun of strength pi,
# plus 0.8 of the render's 0.05 grey world
DIFFUSE_GREY = 0.8
WORLD_GREY = 0.05


def assignments(script):
    """The module-level NAME = literal assignments of a Blender script, a Vector(...) or tuple read as its numbers."""
    found = {}
    for node in ast.parse((HERE / script).read_text()).body:
        if not (isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name)):
            continue
        value = node.value.args[0] if isinstance(node.value, ast.Call) and node.value.args else node.value
        try:
            found[node.targets[0].id] = ast.literal_eval(value)
        except ValueError:
            continue
    return found


def page_number(name):
    return float(re.search(rf"^const {name} = ([-\d.]+);", PAGE, re.M).group(1))


def page_vector(name):
    numbers = re.search(rf"^const {name} = new THREE\.Vector3\(([^)]*)\);", PAGE, re.M).group(1)
    return tuple(float(n) for n in numbers.split(","))


def test_the_look_is_toon_py():
    toon = assignments("toon.py")
    assert page_vector("LIGHT_FROM") == toon["LIGHT_FROM"]
    assert page_vector("SHADE") == toon["SHADE"][:3]
    assert page_vector("OUTLINE_COLOUR") == toon["OUTLINE_COLOUR"][:3]
    assert page_number("OUTLINE_WIDTH") == toon["OUTLINE_WIDTH"]
    assert page_number("LIT_FROM") == pytest.approx((toon["LIT_FROM"] - DIFFUSE_GREY * WORLD_GREY) / DIFFUSE_GREY)


def test_the_camera_is_render_clips():
    render, snaps = assignments("render_clips.py"), assignments("snaps.py")
    assert page_number("FRAMED_HEIGHT") == render["FRAMED_HEIGHT"]
    assert page_number("FRAMED_MIDDLE") == render["FRAMED_MIDDLE"]
    assert page_number("DISTANCE") == snaps["DISTANCE"]


def test_the_clips_are_clips_py():
    clips = assignments("clips.py")
    for name in ("HANG", "HOLD_LIFT", "HOLD_SWING", "HOLD_TWIST", "HOLD_ROLL", "RAISED_ROLL", "BLINK_OPENNESS", "WAVE_BACK", "WAVE_BEND", "WAVE_SWING",
                 "CHIN_REST", "THINK_ELBOW", "THINK_HAND", "THINK_TIP", "SLEEP_TILT"):
        assert re.search(rf"^const {name} = {re.escape(str(clips[name]).replace('(', '[').replace(')', ']'))};", PAGE, re.M), name
    assert page_number("MIN_EYE_HEIGHT") == assignments("rig.py")["MIN_EYE_HEIGHT"]
    for name, frames, fps, loops in re.findall(r'Clip\("(\w+)", (\d+), (\d+), (True|False),', (HERE / "clips.py").read_text()):
        assert f'{{name: "{name}", frames: {frames}, fps: {fps}, loops: {loops.lower()}, pose: {name}}}' in PAGE, name
