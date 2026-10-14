// @vitest-environment node
import {expect, test} from "vitest";
import {collisionParts, isArm, isProtected, shown, sweepCases} from "./figureCollisionScope.js";

const mesh = (attachment, name = attachment) => ({name, visible: true, isSkinnedMesh: true, userData: {attachment, hull: {}}, parent: null});

test("the sweep includes both review angles, every frame and every allowed posture", () => {
    const clips = [{name: "idle", frames: 2, postures: ["stand", "sit", "walk"]}, {name: "polish", frames: 3, postures: ["stand"], voices: ["butler"]}];
    const cases = sweepCases(clips, "butler");
    expect(cases).toHaveLength(18);
    expect(new Set(cases.map((sample) => JSON.stringify(sample))).size).toBe(18);
    expect(sweepCases(clips, "squire")).toHaveLength(12);
    expect(cases).toContainEqual({clip: "polish", posture: "stand", facing: 70, frame: 2});
});

test("upper arms, joints, sleeves and carried items are not exempted", () => {
    for (const name of ["upper_arm_shell_r", "shoulder_joint_r", "squire_pauldrons__shell_r"]) expect(isArm(mesh("arm_r_root", name))).toBe(true);
    expect(isArm(mesh("forearm_l_root"))).toBe(true);
    expect(isArm(mesh("hand_r_root", "squire_shield__rim"))).toBe(true);
    for (const attachment of ["head_root", "torso_root", "pelvis_root"]) expect(isProtected(mesh(attachment))).toBe(true);
});

test("hidden ancestors hide descendants, but visible props enter the sweep", () => {
    const arm = mesh("arm_r_root"), head = mesh("head_root"), prop = {...mesh(""), isMesh: true};
    const hidden = {...mesh("hand_l_root"), parent: {visible: false, parent: null}};
    const outline = {...mesh("arm_l_root"), userData: {}};
    const figure = {scene: {traverse: (visit) => [arm, head, hidden, outline].forEach(visit)}, book: {traverse: (visit) => visit(prop)}};
    expect(shown(hidden)).toBe(false);
    expect(collisionParts(figure)).toEqual({protectedParts: [head], moving: [arm, prop]});
});
