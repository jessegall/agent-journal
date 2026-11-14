import {expect, test} from "vitest";
import {HEAD_TILT, UPRIGHT, tiltAfter, tiltAt} from "../src/figure/headTilt.js";

test("at rest the head leans now to one side, now the other, now upright, small, held for uneven stretches and eased between", () => {
    let seed = 0.37;
    const random = () => (seed = (seed * 9301 + 0.49297) % 1);
    let tilt = UPRIGHT;
    const leans = [];
    const holds = [];
    for (let now = 0; now < 3600; now += 0.25) {
        const next = tiltAfter(tilt, now, random);
        if (next !== tilt) {
            holds.push(next.until - next.began);
            leans.push(next.to);
        }
        tilt = next;
        expect(Math.abs(tiltAt(tilt, now))).toBeLessThanOrEqual(HEAD_TILT.most + 1e-9);
    }
    expect(leans.some((lean) => lean < -1) && leans.some((lean) => lean > 1) && leans.some((lean) => lean === 0)).toBe(true);
    expect(Math.max(...holds) - Math.min(...holds)).toBeGreaterThan(8);
    // a change eases: halfway through it the head is between the two leans
    const change = tiltAfter({...UPRIGHT, to: 4, until: 10}, 10, () => 0.9);
    const middle = tiltAt(change, 10 + HEAD_TILT.ease / 2);
    expect(Math.min(4, change.to) < middle && middle < Math.max(4, change.to)).toBe(true);
});
