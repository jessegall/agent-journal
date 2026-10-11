"""One armature for the rebuilt robot, its skin weights, and every voice's wardrobe bound to it.

Runs inside Blender (Z up, the robot faces -Y, its left side is +X). Imported by render_sheets.py.
"""
import json
import math
from dataclasses import dataclass
from pathlib import Path

import bpy
from mathutils import Euler, Matrix, Vector
from mathutils.kdtree import KDTree

HERE = Path(__file__).resolve().parent
BASE = HERE / "model" / "robot_base.glb"
WARDROBE = HERE / "wardrobe"
MANIFEST = json.loads((WARDROBE / "wardrobe_manifest.json").read_text())
VOICES = tuple(MANIFEST["outfits"])
SIDES = {"l": 1, "r": -1}
NEAREST_VERTICES = 4
MOST_BONES_PER_VERTEX = 4


@dataclass(frozen=True)
class Bone:
    name: str
    head: tuple
    tail: tuple
    parent: str = ""


def side_bones(side, sign):
    x = lambda value: sign * value
    return [
        Bone(f"shoulder_{side}", (x(0.20), 0, 2.163), (x(0.58), 0, 2.163), "chest"),
        Bone(f"upper_arm_{side}", (x(0.58), 0, 2.163), (x(0.815), 0, 2.163), f"shoulder_{side}"),
        Bone(f"forearm_{side}", (x(0.815), 0, 2.163), (x(1.565), 0, 2.15), f"upper_arm_{side}"),
        Bone(f"hand_{side}", (x(1.565), 0, 2.14), (x(2.30), 0, 2.14), f"forearm_{side}"),
        Bone(f"thigh_{side}", (x(0.32), 0, 1.35), (x(0.41), 0, 0.794), "hips"),
        Bone(f"shin_{side}", (x(0.41), 0, 0.794), (x(0.52), 0, 0.33), f"thigh_{side}"),
        Bone(f"foot_{side}", (x(0.52), 0, 0.33), (x(0.52), -0.65, 0.12), f"shin_{side}"),
        Bone(f"eye_{side}", (x(0.354), -0.90, 3.09), (x(0.354), -0.90, 3.19), "head"),
    ]


BONES = [
    Bone("root", (0, 0, 0), (0, 0, 0.25)),
    Bone("hips", (0, 0, 1.30), (0, 0, 1.56), "root"),
    Bone("spine", (0, 0, 1.56), (0, 0, 1.95), "hips"),
    Bone("chest", (0, 0, 1.95), (0, 0, 2.34), "spine"),
    Bone("neck", (0, 0, 2.34), (0, 0, 2.43), "chest"),
    Bone("head", (0, 0, 2.43), (0, 0, 4.0), "neck"),
    *[bone for side, sign in SIDES.items() for bone in side_bones(side, sign)],
]
SIDED = {"shoulder", "upper_arm", "forearm", "hand", "thigh", "shin", "foot", "eye"}

# A part's skin: the axis it blends along, its bones from low to high, and where each pair of neighbours meets (position, blend width).
Skin = tuple
CHAINS = {
    "torso_shell": ("z", ["hips", "spine", "chest"], [(1.62, 0.12), (1.95, 0.30)]),
    "waist_joint": ("z", ["hips", "spine"], [(1.52, 0.20)]),
    "shoulder_joint": ("reach", ["shoulder", "upper_arm"], [(0.58, 0.25)]),
    "upper_arm_shell": ("reach", ["upper_arm", "forearm"], [(0.815, 0.12)]),
    "elbow_joint": ("reach", ["upper_arm", "forearm"], [(0.828, 0.07)]),
    "forearm_shell": ("reach", ["forearm", "hand"], [(1.54, 0.10)]),
    "wrist_joint": ("reach", ["forearm", "hand"], [(1.548, 0.06)]),
    "hip_joint": ("z", ["thigh", "hips"], [(1.47, 0.10)]),
    "thigh_shell": ("z", ["shin", "thigh", "hips"], [(0.80, 0.12), (1.40, 0.12)]),
    "knee_joint": ("z", ["shin", "thigh"], [(0.79, 0.12)]),
    "shin_shell": ("z", ["foot", "shin", "thigh"], [(0.30, 0.10), (0.74, 0.12)]),
    "ankle_joint": ("z", ["foot", "shin"], [(0.29, 0.10)]),
}
RIGID = {
    "pelvis_shell": "hips", "neck_joint": "neck", "head_shell": "head", "face_screen": "head",
    "ear_casing": "head", "ear_disc": "head", "ear_mount": "head", "ear_ring": "head",
    "eye": "eye", "hand_shell": "hand", "foot_shell": "foot", "foot_sole": "foot",
}
# Where an item rides when it is rigid to one bone: the head wears these.
WORN_ON_HEAD = {"headwear", "eyewear", "head_detail", "helmet_crest"}
# A prop held in a hand: the hand it rides, and where its centre sits above and in front of the palm.
GRIPS = {
    "prop_hand_l": ("hand_l", Vector((0, 0, 0.14))),
    "prop_hand_r": ("hand_r", Vector((0, -0.10, 0.04))),
    "prop_tray": ("hand_l", Vector((0, 0, 0.14))),
}
HEADPHONES = "homie_headphones"


def smooth(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


def blend(position, joints):
    """Weight of each bone in a chain at a position: the bone below the first joint, ... the bone above the last."""
    above = [smooth((position - (at - width / 2)) / width) for at, width in joints]
    weights = []
    for k in range(len(joints) + 1):
        below = above[k - 1] if k else 1.0
        up = above[k] if k < len(joints) else 0.0
        weights.append(below * (1 - up))
    return weights


def bone_of(role, side):
    return f"{role}_{side}" if role in SIDED else role


def skin_of(part):
    """A base part's skin: a function from a vertex position to {bone: weight}."""
    base, _, side = part.rpartition("_")
    if side not in SIDES:
        base, side = part, ""
    if base in CHAINS:
        axis, roles, joints = CHAINS[base]
        names = [bone_of(role, side) for role in roles]

        def chained(co):
            position = abs(co.x) if axis == "reach" else co.z
            return dict(zip(names, blend(position, joints)))
        return chained
    owner = bone_of(RIGID[base], side)
    return lambda co: {owner: 1.0}


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_glb(path):
    """The meshes of a glb, unparented and baked to world coordinates, its empty anchors removed."""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path))
    made = [o for o in bpy.data.objects if o not in before]
    meshes = []
    for obj in made:
        if obj.type != "MESH":
            continue
        world = obj.matrix_world.copy()
        obj.parent = None
        obj.data.transform(world)
        obj.matrix_world = Matrix.Identity(4)
        meshes.append(obj)
    for obj in made:
        if obj.type != "MESH":
            bpy.data.objects.remove(obj)
    return meshes


def build_armature():
    arm_data = bpy.data.armatures.new("rig")
    arm = bpy.data.objects.new("rig", arm_data)
    bpy.context.scene.collection.objects.link(arm)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    for spec in BONES:
        bone = arm_data.edit_bones.new(spec.name)
        bone.head, bone.tail = Vector(spec.head), Vector(spec.tail)
        if spec.parent:
            bone.parent = arm_data.edit_bones[spec.parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    return arm


def assign(obj, weights_of):
    """Writes {bone: weight} per vertex as vertex groups, the strongest few, normalised."""
    groups = {}
    for vertex in obj.data.vertices:
        chosen = sorted(weights_of(vertex.co).items(), key=lambda item: -item[1])[:MOST_BONES_PER_VERTEX]
        total = sum(w for _, w in chosen)
        for name, weight in chosen:
            if weight <= 0.001:
                continue
            group = groups.get(name) or groups.setdefault(name, obj.vertex_groups.new(name=name))
            group.add([vertex.index], weight / total, "REPLACE")


def bind(obj, arm):
    modifier = obj.modifiers.new("rig", "ARMATURE")
    modifier.object = arm


class Body:
    """The base robot's vertices with their weights, so clothing can take the weights of the skin under it."""

    def __init__(self, parts):
        self.skin = {}
        count = sum(len(p.data.vertices) for p in parts)
        self.tree = KDTree(count)
        self.weights = []
        for part in parts:
            skin = skin_of(part.name)
            for vertex in part.data.vertices:
                self.tree.insert(vertex.co, len(self.weights))
                self.weights.append(skin(vertex.co))
        self.tree.balance()

    def weights_under(self, co):
        merged = {}
        for _, index, distance in self.tree.find_n(co, NEAREST_VERTICES):
            pull = 1 / (distance + 1e-4)
            for name, weight in self.weights[index].items():
                merged[name] = merged.get(name, 0) + weight * pull
        total = sum(merged.values())
        return {name: weight / total for name, weight in merged.items()}


@dataclass
class Figure:
    voice: str
    armature: object
    carry: dict


def item_voice(item):
    return item.split("_", 1)[0]


def hidden_parts(items):
    return {part for item in items for part in MANIFEST["assets"][item]["hide_base_parts"]}


def hidden_asset_parts(items):
    return {part for item in items for part in MANIFEST["assets"][item].get("hide_asset_parts", [])}


def dress(voice, body, arm):
    """Wardrobe meshes of one voice, skinned to the same armature; held props ride a hand and stay level."""
    items = MANIFEST["outfits"][voice]
    carry = {}
    for item in items:
        slot = MANIFEST["assets"][item]["slot"]
        meshes = [m for m in import_glb(WARDROBE / f"{item}.glb") if m.name not in hidden_asset_parts(items)]
        for mesh in meshes:
            if slot in GRIPS:
                carry.setdefault(GRIPS[slot][0], (GRIPS[slot][1], []))[1].append(mesh)
            elif slot in WORN_ON_HEAD or item == HEADPHONES:
                assign(mesh, lambda co: {"head": 1.0})
                bind(mesh, arm)
            else:
                assign(mesh, body.weights_under)
                bind(mesh, arm)
    return carry


def hold(carry, arm):
    """Each prop follows its hand's position only, so a tray stays level, and sits on the palm."""
    for bone, (grip, meshes) in carry.items():
        hand = Vector(next(b for b in BONES if b.name == bone).head)
        low = Vector((min(v.co[i] for m in meshes for v in m.data.vertices) for i in range(3)))
        high = Vector((max(v.co[i] for m in meshes for v in m.data.vertices) for i in range(3)))
        shift = hand + grip - (low + high) / 2
        anchor = bpy.data.objects.new(f"hold_{bone}", None)
        bpy.context.scene.collection.objects.link(anchor)
        anchor.location = hand
        constraint = anchor.constraints.new("COPY_LOCATION")
        constraint.target, constraint.subtarget = arm, bone
        for mesh in meshes:
            mesh.data.transform(Matrix.Translation(shift - hand))
            mesh.parent = anchor


def assemble(voice):
    """The scene for one voice: its armature, the base body without the parts its clothes cover, and its wardrobe."""
    clear_scene()
    parts = import_glb(BASE)
    arm = build_armature()
    body = Body(parts)
    items = MANIFEST["outfits"][voice]
    covered = hidden_parts(items)
    for part in parts:
        if part.name in covered:
            bpy.data.objects.remove(part)
            continue
        assign(part, skin_of(part.name))
        bind(part, arm)
    carry = dress(voice, body, arm)
    hold(carry, arm)
    return Figure(voice, arm, carry)


def rest_rotation(bone):
    return bone.matrix_local.to_3x3()


def turn(arm, name, x=0.0, y=0.0, z=0.0, order="XYZ"):
    """Rotates a bone about its own head, the angles in degrees in its parent's frame: X along a limb's reach or round a spine's depth, Y front to back, Z up."""
    pose_bone = arm.pose.bones[name]
    rest = rest_rotation(pose_bone.bone)
    delta = Euler((math.radians(x), math.radians(y), math.radians(z)), order).to_matrix()
    pose_bone.rotation_mode = "QUATERNION"
    pose_bone.rotation_quaternion = (rest.inverted() @ delta @ rest).to_quaternion()


def key(arm, frame):
    for pose_bone in arm.pose.bones:
        pose_bone.keyframe_insert("rotation_quaternion", frame=frame)
        pose_bone.keyframe_insert("location", frame=frame)
        pose_bone.keyframe_insert("scale", frame=frame)
