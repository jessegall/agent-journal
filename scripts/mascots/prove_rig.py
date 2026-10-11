"""Poses the rig through its extremes, measures what the skin did, and renders each pose.

    blender -b -P prove_rig.py -- --out DIR [--voices butler,squire] [--no-render]

Writes DIR/report.json and, unless --no-render, one sheet per voice: every pose from the front and from the side.
"""
import json
import sys
from dataclasses import dataclass
from pathlib import Path

import bpy
import numpy
from mathutils.kdtree import KDTree

sys.path.insert(0, str(Path(__file__).resolve().parent))

from rig import VOICES, Posing, assemble, rest  # noqa: E402
from snaps import render_cell, set_up_render, sheet  # noqa: E402

CELL = 360
SAMPLE_LIMIT = 2500
MIN_EDGE = 1e-3
STRETCHED = 1.5
SQUASHED = 0.6
SHEET_COLUMNS = 6


def both(bone, x=0.0, y=0.0, z=0.0, mirror=("y", "z")):
    """The same turn on a bone's left and right: the axes named in mirror flip sign on the right."""
    left = {"x": x, "y": y, "z": z}
    right = {axis: -value if axis in mirror else value for axis, value in left.items()}
    return [(f"{bone}_l", left), (f"{bone}_r", right)]


POSES = {
    "arms_up": both("upper_arm", y=-90),
    "arms_forward": both("upper_arm", z=-90),
    "arms_down": both("upper_arm", y=80),
    "elbows_bent": both("upper_arm", z=-40) + both("forearm", z=-130),
    "knees_bent": both("thigh", x=-70, mirror=()) + both("shin", x=110, mirror=()),
    "legs_apart": both("thigh", y=-35) + both("foot", y=35),
    "head_turned": [("neck", {"z": 20}), ("head", {"z": 55, "x": -20})],
    "bowing": [("spine", {"x": 35}), ("chest", {"x": 25}), ("head", {"x": 20})],
    "twisted": [("spine", {"z": 25}), ("chest", {"z": 25}), ("head", {"z": -30})],
    "walking": both("thigh", x=-35, mirror=("x",)) + both("shin", x=45, mirror=()) + both("upper_arm", z=25, mirror=("z",)) + [("forearm_l", {"z": -50})],
}
VIEWS = {"front": 0.0, "side": 90.0}


def apply(arm, name):
    posing = Posing(arm)
    for bone, angles in POSES[name]:
        posing.turn(bone, **angles)


def evaluated_points(obj):
    graph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(graph)
    mesh = evaluated.to_mesh()
    points = numpy.array([tuple(obj.matrix_world @ v.co) for v in mesh.vertices])
    evaluated.to_mesh_clear()
    return points


@dataclass
class Stretch:
    worst_part: str
    longest: float
    shortest: float
    stretched: int
    squashed: int

    def as_dict(self):
        return {"worst_part": self.worst_part, "longest": round(self.longest, 3), "shortest": round(self.shortest, 3), "stretched": self.stretched, "squashed": self.squashed}


def edge_ratios(obj, before, after):
    edges = numpy.array([tuple(e.vertices) for e in obj.data.edges])
    first = numpy.linalg.norm(before[edges[:, 0]] - before[edges[:, 1]], axis=1)
    second = numpy.linalg.norm(after[edges[:, 0]] - after[edges[:, 1]], axis=1)
    long_enough = first > MIN_EDGE
    return second[long_enough] / first[long_enough]


def stretch_of(parts, rest_points, posed_points):
    worst = ("", 1.0)
    longest, shortest, stretched, squashed = 1.0, 1.0, 0, 0
    for part in parts:
        ratios = edge_ratios(part, rest_points[part.name], posed_points[part.name])
        if float(ratios.max()) > worst[1]:
            worst = (part.name, float(ratios.max()))
        longest, shortest = max(longest, float(ratios.max())), min(shortest, float(ratios.min()))
        stretched += int((ratios > STRETCHED).sum())
        squashed += int((ratios < SQUASHED).sum())
    return Stretch(worst[0], longest, shortest, stretched, squashed)


def tree_of(points):
    tree = KDTree(len(points))
    for index, point in enumerate(points):
        tree.insert(point, index)
    tree.balance()
    return tree


def body_points(figure, store):
    return numpy.concatenate([store[part.name] for part in figure.body])


def drift_of(figure, rest_points, posed_points):
    """How far each garment drifts from the body under it: the change in its distance to the body vertex it started beside, per slot."""
    rest_body, posed_body = body_points(figure, rest_points), body_points(figure, posed_points)
    tree = tree_of(rest_body)
    drift = {}
    for mesh in figure.worn:
        step = max(1, len(rest_points[mesh.name]) // SAMPLE_LIMIT)
        moves = []
        for i in range(0, len(rest_points[mesh.name]), step):
            _, nearest, before = tree.find(rest_points[mesh.name][i])
            moves.append(abs(numpy.linalg.norm(posed_points[mesh.name][i] - posed_body[nearest]) - before))
        slot = mesh["slot"]
        drift[slot] = max(drift.get(slot, 0.0), float(numpy.percentile(moves, 95)))
    return {slot: round(value, 3) for slot, value in drift.items()}


def weight_facts(figure):
    """Vertices without a weight, the most bones on one vertex, and how far a vertex's weights stray from summing to one."""
    facts = {"unweighted": 0, "most_bones": 0, "worst_sum_error": 0.0, "meshes": 0}
    for obj in figure.body + figure.worn:
        facts["meshes"] += 1
        for vertex in obj.data.vertices:
            total = sum(g.weight for g in vertex.groups)
            facts["unweighted"] += not vertex.groups
            facts["most_bones"] = max(facts["most_bones"], len(vertex.groups))
            facts["worst_sum_error"] = max(facts["worst_sum_error"], abs(total - 1.0))
    facts["worst_sum_error"] = round(facts["worst_sum_error"], 6)
    return facts


def legwear_on_thighs(figure):
    """Share of the legwear's vertices beside the thighs whose strongest bone is a thigh."""
    legs = [(o, v) for o in figure.worn if o["slot"] == "legs" for v in o.data.vertices if 0.95 < v.co.z < 1.30]
    if not legs:
        return None
    return round(sum(o.vertex_groups[max(v.groups, key=lambda g: g.weight).group].name.startswith("thigh") for o, v in legs) / len(legs), 3)


def snapshot(figure):
    return {o.name: evaluated_points(o) for o in figure.body + figure.worn}


def measure(figure):
    arm = figure.armature
    rest(arm)
    rest_points = snapshot(figure)
    report = {"bones": [b.name for b in arm.data.bones], **weight_facts(figure), "legwear_on_thighs": legwear_on_thighs(figure), "poses": {}}
    for name in POSES:
        apply(arm, name)
        posed = snapshot(figure)
        report["poses"][name] = {"body": stretch_of(figure.body, rest_points, posed).as_dict(), "garment_drift": drift_of(figure, rest_points, posed)}
    rest(arm)
    return report


def render_poses(figure, folder):
    camera = set_up_render((CELL, CELL), height=4.9)
    cells = []
    for name in POSES:
        apply(figure.armature, name)
        for view, azimuth in VIEWS.items():
            cell = folder / f"cell_{name}_{view}.png"
            render_cell(camera, azimuth, cell)
            cells.append(cell)
    rest(figure.armature)
    return cells


def main():
    given = sys.argv[sys.argv.index("--") + 1:]
    out = Path(given[given.index("--out") + 1])
    voices = given[given.index("--voices") + 1].split(",") if "--voices" in given else ["bare", *VOICES]
    out.mkdir(parents=True, exist_ok=True)
    report = {}
    for voice in voices:
        figure = assemble(None if voice == "bare" else voice)
        report[voice] = measure(figure)
        if "--no-render" in given:
            continue
        cells = render_poses(figure, out)
        sheet(cells, SHEET_COLUMNS, (CELL, CELL), out / f"{voice}.png")
        for cell in cells:
            cell.unlink()
    (out / "report.json").write_text(json.dumps(report, indent=1))


main()
