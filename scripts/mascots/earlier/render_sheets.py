"""Rebuilds every voice's sprite sheets from the rig.

    blender -b -P render_sheets.py -- [--voices butler,coach] [--clips idle,wave] [--out dir] [--size 1024]

A sheet is a horizontal strip of 256 px cells, one per frame of a clip, written as <voice>_<kind>_<name>_sheet.png.
A new animation is a clip in clips.py and a line in SHEETS; nothing else changes.
"""
import math
import sys
from dataclasses import dataclass
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))

from clips import CLIPS, Stance, bake, rest_pose  # noqa: E402
from rig import MANIFEST, VOICES, assemble  # noqa: E402

CELL = 256
BASELINE = 199
OUT = Path(__file__).resolve().parents[2] / "src" / "web" / "public" / "voices"

# A clip's sheet is named <voice>_<kind>_<name>_sheet.png: the viewer plays an idle sheet named blinking as the blink, any other kind in the dialog only.
SHEETS = {
    "idle": "idle_breathing",
    "blink": "idle_blinking",
    "nod": "nod",
    "shake": "shake",
    "wave": "wave",
    "think": "think",
    "celebrate": "celebrate",
    "sleep": "sleep",
}


@dataclass(frozen=True)
class Place:
    """Where a voice's figure stands in its cell, read off the drawn sheet: its height, its middle, and the stance it takes."""
    height: int
    middle: int
    stance: Stance


PLACES = {
    "butler": Place(111, 126, Stance(carrying=("l",), waving="r")),
    "coach": Place(128, 130, Stance(carrying=("r",), waving="l")),
    "colleague": Place(137, 127, Stance(carrying=("l",), waving="r")),
    "homie": Place(112, 141, Stance(waving="r")),
    "squire": Place(100, 136, Stance(carrying=("l", "r"), waving="l")),
}
YAW = 24.0
PITCH = 12.0
OUTLINE = (0.07, 0.06, 0.12)
SHADE = (0.70, 0.66, 0.84)
LINE_PIXELS = 1.35
EMISSIVE = {"eye_ivory"}


def principled_color(material):
    shader = next((n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    return tuple(shader.inputs["Base Color"].default_value) if shader else (0.8, 0.8, 0.8, 1.0)


def toonify(material):
    """Replaces a material with two flat tones of its colour, lit by the scene's lights, so the render reads as drawn."""
    color = principled_color(material)
    material.use_nodes = True
    tree = material.node_tree
    tree.nodes.clear()
    output = tree.nodes.new("ShaderNodeOutputMaterial")
    emit = tree.nodes.new("ShaderNodeEmission")
    tree.links.new(emit.outputs["Emission"], output.inputs["Surface"])
    if material.name.split(".")[0] in EMISSIVE or color[:3] == (0.0, 0.0, 0.0):
        emit.inputs["Color"].default_value = color
        return
    diffuse = tree.nodes.new("ShaderNodeBsdfDiffuse")
    diffuse.inputs["Color"].default_value = (1, 1, 1, 1)
    to_rgb = tree.nodes.new("ShaderNodeShaderToRGB")
    ramp = tree.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "LINEAR"
    ramp.color_ramp.elements[0].position, ramp.color_ramp.elements[0].color = 0.30, (*SHADE, 1)
    ramp.color_ramp.elements[1].position, ramp.color_ramp.elements[1].color = 0.42, (1, 1, 1, 1)
    tint = tree.nodes.new("ShaderNodeMix")
    tint.data_type, tint.blend_type = "RGBA", "MULTIPLY"
    tint.inputs["Factor"].default_value = 1.0
    tint.inputs["B"].default_value = color
    tree.links.new(diffuse.outputs["BSDF"], to_rgb.inputs["Shader"])
    tree.links.new(to_rgb.outputs["Color"], ramp.inputs["Fac"])
    tree.links.new(ramp.outputs["Color"], tint.inputs["A"])
    tree.links.new(tint.outputs["Result"], emit.inputs["Color"])


def lights():
    sun = bpy.data.objects.new("key", bpy.data.lights.new("key", "SUN"))
    sun.data.energy = 3.0
    sun.rotation_euler = (math.radians(50), 0, math.radians(-38))
    bpy.context.scene.collection.objects.link(sun)


def setup_scene(size):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = scene.render.resolution_y = size
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "Standard"
    scene.render.use_freestyle = True
    scene.render.line_thickness_mode = "ABSOLUTE"
    scene.render.line_thickness = LINE_PIXELS * size / CELL
    layer = bpy.context.view_layer
    layer.use_freestyle = True
    lineset = layer.freestyle_settings.linesets.new("ink") if not layer.freestyle_settings.linesets else layer.freestyle_settings.linesets[0]
    lineset.select_silhouette = lineset.select_border = lineset.select_crease = True
    lineset.linestyle = lineset.linestyle or bpy.data.linestyles.new("ink")
    lineset.linestyle.color = OUTLINE
    lineset.linestyle.thickness = 1.0
    for material in bpy.data.materials:
        toonify(material)
    lights()


def figure_top(figure):
    """The highest point of the dressed figure at rest, in world units."""
    meshes = [o for o in bpy.data.objects if o.type == "MESH" and o.parent is None]
    return max((o.matrix_world @ Vector(c)).z for o in meshes for c in o.bound_box)


def frame_camera(figure, place, size):
    """An orthographic camera that puts the figure's feet on the drawn baseline, as tall as the drawn voice, turned a little to the viewer's right."""
    scale = place.height / figure_top(figure)
    data = bpy.data.cameras.new("cell")
    data.type = "ORTHO"
    data.ortho_scale = CELL / scale
    camera = bpy.data.objects.new("cell", data)
    bpy.context.scene.collection.objects.link(camera)
    yaw, pitch = math.radians(YAW), math.radians(PITCH)
    forward = Vector((math.sin(yaw) * math.cos(pitch), math.cos(yaw) * math.cos(pitch), -math.sin(pitch)))
    right = Vector((math.cos(yaw), -math.sin(yaw), 0))
    centre = right * ((CELL / 2 - place.middle) / scale) + Vector((0, 0, (BASELINE - CELL / 2) / scale))
    camera.location = centre - forward * 30
    camera.rotation_euler = (math.pi / 2 - pitch, 0, -yaw)
    bpy.context.scene.camera = camera


def downsample(pixels, size):
    """A cell's rendered pixels averaged down to CELL px, in premultiplied alpha so edges stay clean."""
    factor = size // CELL
    premultiplied = pixels.copy()
    premultiplied[..., :3] *= premultiplied[..., 3:4]
    blocks = premultiplied.reshape(CELL, factor, CELL, factor, 4).mean(axis=(1, 3))
    alpha = blocks[..., 3:4]
    blocks[..., :3] = np.where(alpha > 1e-4, blocks[..., :3] / np.maximum(alpha, 1e-4), 0)
    return blocks


def render_frame(path, size):
    bpy.context.scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    image = bpy.data.images.load(str(path))
    image.colorspace_settings.name = "Non-Color"
    raw = np.empty(size * size * 4, dtype=np.float32)
    image.pixels.foreach_get(raw)
    bpy.data.images.remove(image)
    return downsample(raw.reshape(size, size, 4)[::-1], size)


def save_strip(cells, path):
    strip = np.concatenate(cells, axis=1)
    image = bpy.data.images.new("strip", strip.shape[1], strip.shape[0], alpha=True)
    image.colorspace_settings.name = "Non-Color"
    image.pixels.foreach_set(strip[::-1].ravel())
    image.filepath_raw = str(path)
    image.file_format = "PNG"
    image.save()
    bpy.data.images.remove(image)


def sheet_name(voice, clip):
    return f"{voice}_{SHEETS[clip]}_sheet.png"


def render_voice(voice, clips, out, size):
    figure = assemble(voice)
    place = PLACES[voice]
    bake(figure.armature, place.stance)
    setup_scene(size)
    frame_camera(figure, place, size)
    scratch = out / ".frames"
    scratch.mkdir(parents=True, exist_ok=True)
    for name in clips:
        clip = CLIPS[name]
        figure.armature.animation_data.action = bpy.data.actions[name]
        cells = []
        for frame in range(clip.frames):
            bpy.context.scene.frame_set(frame + 1)
            cells.append(render_frame(scratch / "frame.png", size))
        save_strip(cells, out / sheet_name(voice, name))
        print("SHEET", sheet_name(voice, name), clip.frames, flush=True)


def options():
    rest = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return {rest[i].lstrip("-"): rest[i + 1] for i in range(0, len(rest), 2)}


def main():
    given = options()
    voices = given["voices"].split(",") if "voices" in given else list(VOICES)
    clips = given["clips"].split(",") if "clips" in given else list(CLIPS)
    out = Path(given.get("out", OUT))
    out.mkdir(parents=True, exist_ok=True)
    for voice in voices:
        render_voice(voice, clips, out, int(given.get("size", 1024)))


main()
