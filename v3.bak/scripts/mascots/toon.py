"""The drawn look, laid over the scene at render time: flat colour per piece, one hard step of shade, and an outline.

The meshes and their materials' colours are the model's own; only how they are shown changes, and nothing is saved.
No soft shadow, highlight, occlusion or gradient is drawn, so a surface is one of two flat colours.
"""
import math

import bpy
from mathutils import Vector

LIGHT_FROM = Vector((-0.35, -0.8, 0.5))
LIT_FROM = 0.52
SHADE = (0.60, 0.60, 0.70, 1.0)
OUTLINE_COLOUR = (0.02, 0.02, 0.05, 1.0)
OUTLINE_WIDTH = 0.036


def base_colour(material):
    node = next(n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    return tuple(node.inputs["Base Color"].default_value)


def flat_colour(material, colour):
    """The material rebuilt to show its own colour in two flat steps, lit or shaded, and nothing else."""
    tree = material.node_tree
    tree.nodes.clear()
    light = tree.nodes.new("ShaderNodeBsdfDiffuse")
    to_colour = tree.nodes.new("ShaderNodeShaderToRGB")
    steps = tree.nodes.new("ShaderNodeValToRGB")
    own = tree.nodes.new("ShaderNodeRGB")
    shaded = tree.nodes.new("ShaderNodeMix")
    emit = tree.nodes.new("ShaderNodeEmission")
    out = tree.nodes.new("ShaderNodeOutputMaterial")
    steps.color_ramp.interpolation = "CONSTANT"
    steps.color_ramp.elements[0].color = SHADE
    steps.color_ramp.elements[1].position = LIT_FROM
    steps.color_ramp.elements[1].color = (1, 1, 1, 1)
    own.outputs[0].default_value = colour
    shaded.data_type, shaded.blend_type, shaded.inputs["Factor"].default_value = "RGBA", "MULTIPLY", 1.0
    links = tree.links
    links.new(light.outputs["BSDF"], to_colour.inputs["Shader"])
    links.new(to_colour.outputs["Color"], steps.inputs["Fac"])
    links.new(own.outputs["Color"], shaded.inputs["A"])
    links.new(steps.outputs["Color"], shaded.inputs["B"])
    links.new(shaded.outputs["Result"], emit.inputs["Color"])
    links.new(emit.outputs["Emission"], out.inputs["Surface"])


def outline_material():
    material = bpy.data.materials.new("outline")
    material.use_nodes = True
    tree = material.node_tree
    tree.nodes.clear()
    emit = tree.nodes.new("ShaderNodeEmission")
    out = tree.nodes.new("ShaderNodeOutputMaterial")
    emit.inputs["Color"].default_value = OUTLINE_COLOUR
    tree.links.new(emit.outputs["Emission"], out.inputs["Surface"])
    material.use_backface_culling = True
    return material


def outline(obj, material):
    """A shell a little larger than the piece, drawn only from the inside, which shows as a line round it."""
    assert len(obj.data.materials) == 1, f"{obj.name} has more than one material"
    obj.data.materials.append(material)
    hull = obj.modifiers.new("outline", "SOLIDIFY")
    hull.thickness, hull.offset, hull.use_flip_normals, hull.use_rim = OUTLINE_WIDTH, 1.0, True, False
    hull.material_offset = 1


def lit_from_above_left():
    sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
    sun.data.use_shadow, sun.data.energy = False, math.pi
    sun.rotation_euler = (-LIGHT_FROM).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.collection.objects.link(sun)


def apply():
    for material in list(bpy.data.materials):
        if material.use_nodes:
            flat_colour(material, base_colour(material))
    line = outline_material()
    for obj in bpy.data.objects:
        if obj.type == "MESH" and not obj.hide_render:
            outline(obj, line)
    lit_from_above_left()
