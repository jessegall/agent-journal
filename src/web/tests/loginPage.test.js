import {expect, test, vi} from "vitest";
import {answered, loginPage} from "../src/api/transport.js";

const reply = (status, body) => new Response(JSON.stringify(body), {status, headers: {"Content-Type": "application/json"}});

test("a login that ran out on a journal on a server opens its login page", async () => {
    const open = vi.spyOn(loginPage, "open").mockImplementation(() => {});
    await expect(answered(reply(401, {error: "your login ran out; log in again", login: "/login?notice=ran-out"}), "")).rejects.toThrow("ran out");
    expect(open).toHaveBeenCalledWith("/login?notice=ran-out");
    open.mockClear();
    await expect(answered(reply(401, {error: "this phone is not connected"}), "")).rejects.toThrow("not connected");
    expect(open).not.toHaveBeenCalled();
});
