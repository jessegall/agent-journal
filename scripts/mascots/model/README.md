# Robot reference rebuild v3

## Open first

For a 3D application, start with `model/robot_base.glb`. The OBJ alternative is `model/robot_base.obj`; keep `robot_base.mtl` beside it. GLB is the primary deliverable.

## What was rebuilt

The front-view landmarks in the supplied image set the head/body proportions, screen size, joint heights, T-pose arm span, hand outline, and foot spacing. The face is a rounded rectangular surface fitted to the head, not an oval or a rectangular box embedded in a sphere. Eyes are two independent meshes; there is no mouth.

The model contains 42 named base meshes and 37 separate wardrobe/prop asset files. The complete collection contains 272 named mesh parts. The five `model/*_assembled.glb` files are convenience assemblies with the covered body regions hidden.

## Names and tags

Every GLB mesh node has a stable `name` plus `extras`: `part_id`, `category`, `asset_id`, `attachment`, and `material_id`. Clothing parts also carry `slot` metadata; left/right parts use the robot's anatomical left/right. The complete index is `model/part_tags.json`.

Important names:
- `head_shell`
- `face_screen` (independent mesh, planar 0-1 UV layout)
- `eye_l`, `eye_r`
- `ear_casing_l`, `ear_casing_r`, `ear_disc_l`, `ear_disc_r`
- `torso_shell`, `waist_joint`, `pelvis_shell`
- `upper_arm_shell_l/r`, `forearm_shell_l/r`, `hand_shell_l/r`
- `thigh_shell_l/r`, `shin_shell_l/r`, `foot_shell_l/r`

The OBJ contains matching object/group names. Use the JSON index for the extended metadata. GLB also contains named attachment/pivot nodes such as `head_root`, `hand_l_root`, and `hand_r_root`. These are transform anchors, not a weighted animation skeleton.

## Coordinate system and clothing

Delivered GLB and OBJ files use Y up, +Z front; feet sit at Y=0. The unclothed robot is 4.0 model units high. No physical scale was supplied, so those are not asserted to be metres. All clothing files retain the same origin, scale and bind coordinates: import at identity transform, and do not recenter individual items.

`wardrobe/wardrobe_manifest.json` defines each item's clothing slot, outfit membership, covered base parts and covered inner-clothing parts. The assembled GLBs apply those visibility masks. Other applications should use those same masks. Use only one item per exclusive slot. Shirt + waistcoat + tailcoat is a supported layered combination; arbitrary combinations have not all been collision-tested.

## Previews and verification

`previews/reference_comparison.png` places the supplied front view beside an orthographic render of the re-imported delivered OBJ at the same normalized height. `robot_turnaround.png` uses upright left/front/right/back cameras. `wardrobe_overview.png` shows the five actual 3D assemblies.

`quality_report.json` records name/tag checks, GLB buffer and index validation, normal checks, winding checks, and OBJ re-import bounds comparison. These checks verify the exported data, not aesthetic perfection or animation readiness.

## Scope and limitations

This is a reference-fitted reconstruction, not a scan or a guaranteed exact 1:1 recovery. The source supplies stylized 2D views, and its side-view arms are not consistent with a strictly orthographic T-pose. The model keeps a physically consistent T-pose; unseen depth and clothing backs are inferred. The reference does not specify real-world dimensions.

The meshes are static, material-colored assets with separate editable parts. They are not skinned, animated, cloth-simulated, retopologized for production deformation, or certified for 3D printing. Most surfaces have geometry-based detail rather than texture maps; only the main display has a dedicated 0-1 UV layout.

A native .blend file is not included. `source/open_in_blender.py` is an optional import/setup script that creates one when run in Blender. It clears the current Blender scene, so run it in a new/empty session. That optional script was not executed in Blender in this environment; the delivered GLB/OBJ files were verified separately, including OBJ re-import and upright renders.

## Rebuild source

`source/rebuild.py` reconstructs and exports the package from its parameterized geometry. It requires Python with numpy, scipy, trimesh, shapely 2.1+ with GEOS 3.13+, Pillow and VTK. No external image-generation service is involved in mesh construction or previews. `source/requirements.txt` records the versions used here.
