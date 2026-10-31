import {expect, test} from "vitest";
import {pageRoute} from "../src/pageRoute.js";

test("the address picks the page: a float's window, an agent's page, a fixed row of windows, else the home page", () => {
    expect(pageRoute("?view=notes.board&float=3&environment=work")).toEqual({page: "view", props: {environment: "work", view: "notes.board", float: 3}});
    expect(pageRoute("?agent=12")).toEqual({page: "agent", props: {environment: "main", agent: 12}});
    expect(pageRoute("?windows=a.one,a.two")).toEqual({page: "shell", props: {environment: "main", layout: ["a.one", "a.two"]}});
    expect(pageRoute("")).toEqual({page: "home", props: {environment: "main"}});
    expect(pageRoute("?view=a.b&agent=1").page).toBe("view");
});
