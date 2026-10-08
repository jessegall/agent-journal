import {describe, expect, test} from "vitest";
import {PAGES as titles} from "../src/domain/navigation.js";
import {PAGES} from "../src/route.js";

describe("the secrets page", () => {
    test("is a page of the project with a title and an icon, so the sidebar lists it", () => {
        expect(PAGES).toContain("secrets");
        expect(titles.secrets).toMatchObject({title: "Secrets", icon: "key"});
    });
});
