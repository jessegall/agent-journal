"""One armature for the robot, skinned onto its base body, with every voice's wardrobe bound to the same bones.

Runs inside Blender, where the glb arrives Z up with the robot facing -Y and its left side on +X.
Bone joints come from the model's own pivots (model/part_tags.json); the few the model leaves out are named below.
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
PIVOTS = json.loads((HERE / "model" / "part_tags.json").read_text())["pivots"]
VOICES = tuple(MANIFEST["outfits"])
SIDES = {"l": 1, "r": -1}
NEAREST_VERTICES = 8
MOST_BONES_PER_VERTEX = 4
MIN_WEIGHT = 0.001
CHEST_BASE = 1.95
NECK_BASE = 2.34
HEAD_TOP = 4.0
TOE = (0.0, -0.65, 0.12)
FINGERTIP = 2.30


def pivot(name, mirror=1):
    """A model pivot in Blender coordinates: the glb's Y up and +Z front become Z up and -Y front."""
    x, y, z = PIVOTS[name]["position"]
    return (mirror * x, -z, y)


@dataclass(frozen=True)
class Bone:
    name: str
    head: tuple
    tail: tuple
    parent: str = ""


def side_bones(side, sign):
    at = lambda name: pivot(f"{name}_{side}_root")
    arm_start, forearm_start, hand_start = at("arm"), at("forearm"), at("hand")
    thigh_start, shin_start, foot_start = at("thigh"), at("shin"), at("foot")
    clavicle = (0.20 * sign, 0.0, arm_start[2])
    fingertip = (FINGERTIP * sign, 0.0, hand_start[2])
    toe = (foot_start[0], TOE[1], TOE[2])
    return [
        Bone(f"shoulder_{side}", clavicle, arm_start, "chest"),
        Bone(f"upper_arm_{side}", arm_start, forearm_start, f"shoulder_{side}"),
        Bone(f"forearm_{side}", forearm_start, hand_start, f"upper_arm_{side}"),
        Bone(f"hand_{side}", hand_start, fingertip, f"forearm_{side}"),
        Bone(f"thigh_{side}", thigh_start, shin_start, "hips"),
        Bone(f"shin_{side}", shin_start, foot_start, f"thigh_{side}"),
        Bone(f"foot_{side}", foot_start, toe, f"shin_{side}"),
    ]


def trunk_bones():
    pelvis, torso, head = pivot("pelvis_root"), pivot("torso_root"), pivot("head_root")
    return [
        Bone("root", (0, 0, 0), (0, 0, 0.25)),
        Bone("hips", pelvis, torso, "root"),
        Bone("spine", torso, (0, 0, CHEST_BASE), "hips"),
        Bone("chest", (0, 0, CHEST_BASE), (0, 0, NECK_BASE), "spine"),
        Bone("neck", (0, 0, NECK_BASE), head, "chest"),
        Bone("head", head, (0, 0, HEAD_TOP), "neck"),
    ]


BONES = trunk_bones() + [bone for side, sign in SIDES.items() for bone in side_bones(side, sign)]
SIDED = {"shoulder", "upper_arm", "forearm", "hand", "thigh", "shin", "foot"}


@dataclass(frozen=True)
class Joint:
    at: float
    width: float


def smooth(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


@dataclass(frozen=True)
class Chain:
    """Bones along one axis, lowest first; each joint is where the bone below hands over to the bone above it."""
    axis: str
    roles: tuple
    joints: tuple

    def weights(self, co, side):
        position = abs(co.x) if self.axis == "reach" else co.z
        above = [smooth((position - (j.at - j.width / 2)) / j.width) for j in self.joints]
        names = [bone_of(role, side) for role in self.roles]
        weights = {}
        for k, name in enumerate(names):
            below = above[k - 1] if k else 1.0
            up = above[k] if k < len(above) else 0.0
            weights[name] = below * (1 - up)
        return weights


TRUNK = Chain("z", ("hips", "spine", "chest"), (Joint(pivot("torso_root")[2], 0.30), Joint(CHEST_BASE, 0.30)))
TORSO = Chain("z", ("spine", "chest"), (Joint(CHEST_BASE, 0.60),))
ARM = Chain("reach", ("chest", "shoulder", "upper_arm", "forearm", "hand"),
            (Joint(0.30, 0.20), Joint(pivot("arm_l_root")[0], 0.25), Joint(pivot("forearm_l_root")[0], 0.16), Joint(pivot("hand_l_root")[0] - 0.015, 0.12)))
LEG = Chain("z", ("foot", "shin", "thigh", "hips"),
            (Joint(pivot("foot_l_root")[2], 0.14), Joint(pivot("shin_l_root")[2], 0.16), Joint(pivot("thigh_l_root")[2] - 0.02, 0.30)))

# How cloth under each base part bends: a chain it blends along, or the one bone it rides rigidly.
SOFT = {
    "torso_shell": TRUNK, "waist_joint": TRUNK, "pelvis_shell": TRUNK,
    "shoulder_joint": ARM, "upper_arm_shell": ARM, "elbow_joint": ARM, "forearm_shell": ARM, "wrist_joint": ARM, "hand_shell": ARM,
    "hip_joint": LEG, "thigh_shell": LEG, "knee_joint": LEG, "shin_shell": LEG, "ankle_joint": LEG,
    "foot_shell": "foot", "foot_sole": "foot", "neck_joint": "neck",
    "head_shell": "head", "face_screen": "head", "ear_casing": "head", "ear_disc": "head", "ear_mount": "head", "ear_ring": "head", "eye": "head",
}
# How the body itself moves: its shells are stiff and a ring on a joint turns half as far as the bone below it, so nothing stretches.
# A pair of roles splits a ring evenly between two bones; a name rides one bone.
BODY = {
    **SOFT,
    "torso_shell": TORSO, "waist_joint": ("hips", "spine"), "pelvis_shell": "hips",
    "shoulder_joint": "upper_arm", "upper_arm_shell": "upper_arm", "elbow_joint": ("upper_arm", "forearm"), "forearm_shell": "forearm",
    "wrist_joint": ("forearm", "hand"), "hand_shell": "hand",
    "hip_joint": "thigh", "thigh_shell": "thigh", "knee_joint": ("thigh", "shin"), "shin_shell": "shin", "ankle_joint": ("shin", "foot"),
}
# Wardrobe that stays one stiff piece on the bone of the body part under its centre.
STIFF_SLOTS = {"shoulder_armor", "forearm_armor", "shin_armor", "feet", "forearm_drape"}
HELD_SLOTS = {"prop_hand_l", "prop_hand_r", "prop_tray"}
# A cape hangs from the shoulders and follows the trunk, never the legs it falls past.
TRUNK_SLOTS = {"back_accessory"}


def bone_of(role, side):
    return f"{role}_{side}" if role in SIDED else role


def part_side(part):
    base, _, side = part.rpartition("_")
    return (base, side) if side in SIDES else (part, "")


class Skin:
    """Where a vertex of a base part goes: {bone: weight} at any position."""

    def __init__(self, part, table=BODY):
        self.base, self.side = part_side(part)
        self.how = table[self.base]

    def weights(self, co):
        if isinstance(self.how, Chain):
            return self.how.weights(co, self.side)
        roles = (self.how,) if isinstance(self.how, str) else self.how
        return {bone_of(role, self.side): 1 / len(roles) for role in roles}


def trunk_weights(co):
    return TRUNK.weights(co, "")


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
    """Writes {bone: weight} per vertex as vertex groups: the strongest few, normalised to one."""
    groups = {}
    for vertex in obj.data.vertices:
        chosen = sorted(weights_of(vertex.co).items(), key=lambda item: -item[1])[:MOST_BONES_PER_VERTEX]
        chosen = [(name, weight) for name, weight in chosen if weight > MIN_WEIGHT]
        total = sum(weight for _, weight in chosen)
        for name, weight in chosen:
            group = groups.get(name) or groups.setdefault(name, obj.vertex_groups.new(name=name))
            group.add([vertex.index], weight / total, "REPLACE")


def bind(obj, arm):
    modifier = obj.modifiers.new("rig", "ARMATURE")
    modifier.object = arm


def centre(obj):
    vertices = [v.co for v in obj.data.vertices]
    return sum(vertices, Vector()) / len(vertices)


class Body:
    """The base robot's vertices, so clothing takes the skin of the body under it."""

    def __init__(self, parts):
        self.skins = []
        self.owner = []
        self.tree = KDTree(sum(len(p.data.vertices) for p in parts))
        for part in parts:
            skin = Skin(part.name, SOFT)
            self.skins.append(skin)
            for vertex in part.data.vertices:
                self.tree.insert(vertex.co, len(self.owner))
                self.owner.append(len(self.skins) - 1)
        self.tree.balance()

    def weights_under(self, co):
        """The skins of the nearest body vertices, each read at this position, nearer ones counting more."""
        merged = {}
        for _, index, distance in self.tree.find_n(co, NEAREST_VERTICES):
            pull = 1 / (distance + 1e-4)
            for name, weight in self.skins[self.owner[index]].weights(co).items():
                merged[name] = merged.get(name, 0) + weight * pull
        total = sum(merged.values())
        return {name: weight / total for name, weight in merged.items()}

    def bone_under(self, co):
        weights = self.weights_under(co)
        return max(weights, key=weights.get)


def covered_parts(items):
    return {part for item in items for part in MANIFEST["assets"][item]["hide_base_parts"]}


def covered_asset_parts(items):
    return {part for item in items for part in MANIFEST["assets"][item].get("hide_asset_parts", [])}


def hand_under(mesh):
    return "hand_l" if centre(mesh).x >= 0 else "hand_r"


def dress(voice, body, arm):
    """Wardrobe meshes of one voice, bound to the same armature."""
    items = MANIFEST["outfits"][voice]
    worn = []
    for item in items:
        slot = MANIFEST["assets"][item]["slot"]
        for mesh in import_glb(WARDROBE / f"{item}.glb"):
            if mesh.name in covered_asset_parts(items):
                bpy.data.objects.remove(mesh)
                continue
            bone = hand_under(mesh) if slot in HELD_SLOTS else body.bone_under(centre(mesh)) if slot in STIFF_SLOTS else ""
            weights = (lambda co, bone=bone: {bone: 1.0}) if bone else trunk_weights if slot in TRUNK_SLOTS else body.weights_under
            assign(mesh, weights)
            bind(mesh, arm)
            mesh["slot"] = slot
            worn.append(mesh)
    return worn


@dataclass
class Figure:
    voice: str
    armature: object
    body: list
    worn: list


def assemble(voice=None):
    """The scene for one voice, or for the bare robot: its armature, the base body, and its wardrobe.

    The body parts a garment covers stay in the scene, hidden from renders, so the body under the clothes can still be measured.
    """
    clear_scene()
    parts = import_glb(BASE)
    arm = build_armature()
    body = Body(parts)
    items = MANIFEST["outfits"][voice] if voice else []
    covered = covered_parts(items)
    for part in parts:
        assign(part, Skin(part.name).weights)
        bind(part, arm)
        part.hide_render = part.name in covered
    worn = dress(voice, body, arm) if voice else []
    return Figure(voice, arm, parts, worn)


def turn(arm, name, x=0.0, y=0.0, z=0.0):
    """Rotates a bone about its own head by angles in degrees about the world's axes, on top of whatever its parent does.

    Call it parent first: each bone reads where its parent now stands.
    """
    pose_bone = arm.pose.bones[name]
    rest = pose_bone.bone.matrix_local
    follows = rest if pose_bone.parent is None else pose_bone.parent.matrix @ pose_bone.parent.bone.matrix_local.inverted() @ rest
    pivot_at = follows.to_translation()
    delta = Matrix.Translation(pivot_at) @ Euler((math.radians(x), math.radians(y), math.radians(z)), "XYZ").to_matrix().to_4x4() @ Matrix.Translation(-pivot_at)
    pose_bone.matrix = delta @ follows
    bpy.context.view_layer.update()


def rest(arm):
    for pose_bone in arm.pose.bones:
        pose_bone.matrix_basis = Matrix.Identity(4)
    bpy.context.view_layer.update()
