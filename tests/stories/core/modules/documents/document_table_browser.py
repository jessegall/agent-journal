from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED

HEAD = "| Area | What the rule says | Why it holds | Where it is checked | Who owns it |"
ROW = "| {area} | The cart counts every price in whole cents and rounds once at the end | Rounding each line drifts from the total | The cart totals test in the shop module | The checkout team |"
BODY = "\\n".join(["Intro line", "## Rules", HEAD, "|---|---|---|---|---|", *(ROW.format(area=area) for area in ("Totals", "Shipping", "Tax"))])


def test_a_wide_table_in_a_document_keeps_readable_columns_and_scrolls_sideways_in_its_own_box(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.expect_success(f'doc make "Cart rules" --abstract "How the cart counts money" --body "{BODY}"', "doc 1: Cart rules", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "documentTable.browser.mjs", [str(tmp_path / "document-table")])
