"""Pictures of the posed robot from Blender: a camera, one render per call, and a sheet that lays pictures in a grid."""
from math import cos, radians, sin

import bpy
import numpy
from mathutils import Vector

import toon

BACKDROP = (0.82, 0.83, 0.86)
LOOK_AT_HEIGHT = 2.15
DISTANCE = 8
WEBP_QUALITY = 82
ANTIALIAS_SAMPLES = 16


def set_up_render(size, height, centre=LOOK_AT_HEIGHT, transparent=False):
    """An orthographic render of this size in the drawn look (see toon.py) that frames `height` model units, centred on the given height."""
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.eevee.taa_render_samples = ANTIALIAS_SAMPLES
    scene.render.resolution_x, scene.render.resolution_y = size
    scene.render.film_transparent = transparent
    scene.render.image_settings.color_mode = "RGBA" if transparent else "RGB"
    scene.view_settings.view_transform = "Standard"
    scene.world = bpy.data.worlds.new("backdrop")
    scene.world.color = BACKDROP
    camera = bpy.data.objects.new("camera", bpy.data.cameras.new("camera"))
    scene.collection.objects.link(camera)
    camera.data.type, camera.data.ortho_scale = "ORTHO", height
    camera["looks_at"] = centre
    scene.camera = camera
    toon.apply()
    return camera


def render_cell(camera, azimuth, path):
    """One picture from an angle round the robot, looking at its middle; 0 is the front."""
    angle = radians(azimuth)
    camera.location = Vector((DISTANCE * sin(angle), -DISTANCE * cos(angle), camera["looks_at"]))
    camera.rotation_euler = (radians(90), 0, angle)
    bpy.context.scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)


def sheet(cells, columns, size, path):
    """Lays the pictures out in a grid, in order, and saves it as one picture: webp when the path says so."""
    width, height = size
    columns = min(columns, len(cells))
    rows = -(-len(cells) // columns)
    canvas = numpy.zeros((rows * height, columns * width, 4), dtype=numpy.float32)
    for index, cell in enumerate(cells):
        image = bpy.data.images.load(str(cell))
        pixels = numpy.empty(width * height * 4, dtype=numpy.float32)
        image.pixels.foreach_get(pixels)
        row, column = divmod(index, columns)
        top = (rows - 1 - row) * height
        canvas[top:top + height, column * width:(column + 1) * width] = pixels.reshape(height, width, 4)
        bpy.data.images.remove(image)
    out = bpy.data.images.new("sheet", columns * width, rows * height, alpha=True)
    out.pixels.foreach_set(canvas.ravel())
    settings = bpy.context.scene.render.image_settings
    settings.file_format = "WEBP" if str(path).endswith(".webp") else "PNG"
    settings.color_mode, settings.quality = "RGBA", WEBP_QUALITY
    out.save_render(str(path))
    bpy.data.images.remove(out)
    settings.file_format = "PNG"
