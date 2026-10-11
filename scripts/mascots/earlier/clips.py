"""The clips every voice plays on the one rig, as bone turns per frame, and the actions they are baked into.

A pose is a turn of bones; a clip is a pose for each of its frames. Angles are degrees in each bone's parent frame (see rig.turn).
"""
import math
from dataclasses import dataclass
from typing import Callable

import bpy

from rig import SIDES, key, turn

ARM_ORDER = "ZYX"


@dataclass(frozen=True)
class Stance:
    """How a voice stands: which arms hold something, and which arm waves."""
    carrying: tuple = ()
    waving: str = "r"


def rest_pose(arm, stance):
    """Every bone back to rest, then the arms hanging, the carrying ones bent to hold."""
    for pose_bone in arm.pose.bones:
        pose_bone.rotation_mode = "QUATERNION"
        pose_bone.rotation_quaternion = (1, 0, 0, 0)
        pose_bone.location = (0, 0, 0)
        pose_bone.scale = (1, 1, 1)
    for side, sign in SIDES.items():
        holds = side in stance.carrying
        swing(arm, side, lower=48 if holds else 72, forward=26 if holds else 8)
        bend(arm, side, 78 if holds else 10)
    turn(arm, "thigh_l", y=-3)
    turn(arm, "thigh_r", y=3)


def swing(arm, side, lower, forward=0.0, twist=0.0):
    """The upper arm: lowered from the T-pose by `lower` degrees, swung forward by `forward`."""
    sign = SIDES[side]
    turn(arm, f"upper_arm_{side}", x=twist, y=sign * lower, z=-sign * forward, order=ARM_ORDER)


def bend(arm, side, degrees):
    """The elbow, bending the forearm forward."""
    turn(arm, f"forearm_{side}", z=-SIDES[side] * degrees, order=ARM_ORDER)


def wave_arm(arm, stance, lift, wag):
    side = stance.waving
    swing(arm, side, lower=-lift, forward=10)
    bend(arm, side, 0)
    turn(arm, f"forearm_{side}", y=-SIDES[side] * wag, z=-SIDES[side] * 20, order=ARM_ORDER)


def wave_phase(t, turns=2):
    return math.sin(2 * math.pi * turns * t)


def breathe(arm, t, amount=1.0):
    turn(arm, "spine", x=1.2 * amount * math.sin(2 * math.pi * t))
    turn(arm, "chest", x=1.8 * amount * math.sin(2 * math.pi * t - 0.5))
    turn(arm, "head", x=-1.5 * amount * math.sin(2 * math.pi * t - 1.0), z=2.0 * amount * math.sin(2 * math.pi * t))


def blink_scale(arm, closed):
    for side in SIDES:
        arm.pose.bones[f"eye_{side}"].scale = (1, max(closed, 0.04), 1)


@dataclass(frozen=True)
class Clip:
    name: str
    frames: int
    loops: bool
    pose: Callable


def idle(arm, stance, t):
    breathe(arm, t)
    blink_scale(arm, 1.0)


def blink(arm, stance, t):
    breathe(arm, 0, 0.0)
    blink_scale(arm, [1, 1, 0.5, 0.04, 0.5, 1][round(t * 6) % 6])


def nod(arm, stance, t):
    turn(arm, "head", x=20 * max(math.sin(2 * math.pi * 2 * t), 0) - 2)
    turn(arm, "neck", x=6 * max(math.sin(2 * math.pi * 2 * t), 0))
    breathe(arm, 0, 0.0)


def shake(arm, stance, t):
    turn(arm, "head", z=24 * math.sin(2 * math.pi * 2 * t))
    turn(arm, "neck", z=8 * math.sin(2 * math.pi * 2 * t))


def wave(arm, stance, t):
    wave_arm(arm, stance, lift=55, wag=24 * wave_phase(t))
    turn(arm, "head", y=-SIDES[stance.waving] * 6, z=-SIDES[stance.waving] * 6)
    breathe(arm, t, 0.5)


def think(arm, stance, t):
    side = stance.waving
    sign = SIDES[side]
    swing(arm, side, lower=14, forward=62)
    turn(arm, f"forearm_{side}", z=-sign * 128, order=ARM_ORDER)
    turn(arm, "head", x=5, y=-sign * 9 + 3 * math.sin(2 * math.pi * t), z=-sign * 8)
    breathe(arm, t, 0.4)


def celebrate(arm, stance, t):
    jump = max(math.sin(2 * math.pi * t), 0)
    arm.pose.bones["root"].location = (0, 0.22 * jump, 0)
    for side, sign in SIDES.items():
        swing(arm, side, lower=-62, forward=0)
        turn(arm, f"forearm_{side}", y=-sign * 18 * math.sin(2 * math.pi * 2 * t), order=ARM_ORDER)
        turn(arm, f"thigh_{side}", x=-14 * jump)
        turn(arm, f"shin_{side}", x=26 * jump)
    turn(arm, "head", x=-8, z=6 * math.sin(2 * math.pi * 2 * t))
    turn(arm, "spine", x=-4)


def sleep(arm, stance, t):
    turn(arm, "head", x=28 + 2 * math.sin(2 * math.pi * t), z=4)
    turn(arm, "neck", x=10)
    turn(arm, "spine", x=8 + 1.5 * math.sin(2 * math.pi * t))
    blink_scale(arm, 0.04)


CLIPS = {c.name: c for c in (
    Clip("idle", 6, True, idle),
    Clip("blink", 6, True, blink),
    Clip("nod", 6, False, nod),
    Clip("shake", 6, False, shake),
    Clip("wave", 8, True, wave),
    Clip("think", 6, True, think),
    Clip("celebrate", 8, False, celebrate),
    Clip("sleep", 6, True, sleep),
)}


def bake(arm, stance):
    """Each clip as an action on the armature: a key per frame, looping ones ending one frame short of their start."""
    arm.animation_data_create()
    for clip in CLIPS.values():
        action = bpy.data.actions.new(clip.name)
        action.use_fake_user = True
        arm.animation_data.action = action
        for frame in range(clip.frames):
            rest_pose(arm, stance)
            clip.pose(arm, stance, frame / clip.frames)
            key(arm, frame + 1)
    arm.animation_data.action = None
