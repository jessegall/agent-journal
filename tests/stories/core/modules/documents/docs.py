from core.base.database.database import Database
from tests.stories.core.support.fixtures import UserJoined

BODY = "Intro line\\n## Totals\\n- in cents\\n- rounded once\\n## Shipping\\nPriced by weight"


def doc_story(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f'doc make "Cart rules" --abstract "How the cart counts money" --body "{BODY}"', "doc 1: Cart rules", actor=story.user)
    return story


def test_a_document_is_made_with_its_abstract_and_listed(new_story):
    story = doc_story(new_story)
    story.expect_text("doc list", "Cart rules", actor=story.user)


def test_a_document_without_an_abstract_is_refused_with_what_an_abstract_is(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('doc make "Notes" --body "text"', "an abstract is required: one short description of the text", actor=story.user)


def test_an_abstract_over_200_characters_is_refused_with_its_length(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f'doc make "Notes" --body "text" --abstract "{"a" * 201}"', "the abstract is 201 characters, longer than 200", actor=story.user)


def test_show_prints_the_title_the_abstract_and_the_numbered_outline_with_line_counts(new_story):
    story = doc_story(new_story)
    story.expect_ordered_lines("doc show 1", "doc 1: Cart rules", "How the cart counts money", "0  (before the first heading)  (1 lines)", "1  Totals  (2 lines)",
                               "2  Shipping  (1 lines)", actor=story.user)


def test_a_section_is_read_by_its_number_or_its_heading_and_its_bullets_alone(new_story):
    story = doc_story(new_story)
    story.expect_text("doc show 1 --section 2", "2. Shipping", "Priced by weight", actor=story.user)
    story.expect_text("doc show 1 --section totals", "1. Totals", "- in cents", actor=story.user)
    story.expect_absent("doc show 1 --section 1 --bullets", "1. Totals", actor=story.user)


def test_a_missing_section_is_refused_with_how_sections_are_numbered(new_story):
    story = doc_story(new_story)
    story.expect_refusal("doc show 1 --section 9", "no section 9: the outline numbers them from 1", actor=story.user)


def test_grep_finds_lines_with_their_section_and_all_prints_the_whole_text(new_story):
    story = doc_story(new_story)
    story.expect_text("doc show 1 --grep cents", "1 Totals: - in cents", actor=story.user)
    story.expect_text("doc show 1 --grep nothing-here", "no line holds nothing-here", actor=story.user)
    story.expect_text("doc show 1 --all", "Intro line", "Priced by weight", actor=story.user)


def test_an_edit_writes_the_text_anew_and_keeps_the_abstract(new_story):
    story = doc_story(new_story)
    story.expect_success('doc edit 1 --body "## Totals\\nin cents"', "doc 1 written anew: Cart rules", actor=story.user)
    story.expect_text("doc show 1", "How the cart counts money", "1  Totals  (1 lines)", actor=story.user)


def test_one_section_is_replaced_and_the_rest_of_the_text_stays(new_story):
    story = doc_story(new_story)
    story.expect_success('doc edit 1 --section Shipping --body "Priced by parcel"', "doc 1 written anew: Cart rules", actor=story.user)
    story.expect_text("doc show 1 --section 2", "2. Shipping", "Priced by parcel", actor=story.user)
    story.expect_text("doc show 1 --section 1", "1. Totals", "- rounded once", actor=story.user)
    story.expect_absent("doc show 1 --all", "Priced by weight", actor=story.user)


def test_a_new_text_for_a_section_that_opens_with_a_heading_renames_the_section(new_story):
    story = doc_story(new_story)
    story.expect_success('doc edit 1 --section 1 --body "## Sums\\nin euros"', "doc 1 written anew: Cart rules", actor=story.user)
    story.expect_text("doc show 1", "1  Sums", "2  Shipping", actor=story.user)


def test_a_section_that_is_not_there_or_is_there_twice_is_refused(new_story):
    story = doc_story(new_story)
    story.expect_refusal('doc edit 1 --section Taxes --body "text"', "no section Taxes: the outline numbers them from 1", actor=story.user)
    story.expect_success('doc edit 1 --body "## Same\\none\\n## Same\\ntwo"', "doc 1 written anew: Cart rules", actor=story.user)
    story.expect_refusal('doc edit 1 --section Same --body "text"', "2 sections are headed Same", actor=story.user)
    story.expect_refusal('doc edit 1 --section 2', "--section needs the section's new text", actor=story.user)


def test_one_exact_piece_is_replaced_and_must_be_there_once(new_story):
    story = doc_story(new_story)
    story.expect_success('doc edit 1 --replace "by weight" --with "by parcel"', "doc 1 written anew: Cart rules", actor=story.user)
    story.expect_text("doc show 1 --all", "Priced by parcel", "- in cents", actor=story.user)
    story.expect_refusal('doc edit 1 --replace "by volume" --with "x"', "the text to replace is there 0 times, not once", actor=story.user)
    story.expect_refusal('doc edit 1 --replace "in" --with "x"', "the text to replace is there", actor=story.user)
    story.expect_refusal('doc edit 1 --with "x"', "--with needs --replace", actor=story.user)


def test_a_part_of_a_report_is_changed_like_a_part_of_a_document(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f'report make "Cart check" --abstract "What the check showed" --body "{BODY}"', "report 1: Cart check", actor=story.user)
    story.expect_success('report edit 1 --section Totals --body "in euros"', "report 1 written anew: What the check showed", actor=story.user)
    story.expect_text("report show 1 --section 1", "in euros", actor=story.user)


def test_broken_markdown_is_refused_at_a_save_with_the_lines_to_fix(new_story):
    story = doc_story(new_story)
    story.expect_refusal('doc edit 1 --body "one\\n```python\\nvalue = 1"', "the Markdown has 1 faults: line 2: this code fence is never closed", actor=story.user)
    story.expect_refusal('doc edit 1 --body "| a | b |\\n|---|---|\\n| 1 |"', "line 3: this row has 1 cells, its header has 2", actor=story.user)
    story.expect_refusal('doc edit 1 --body "| a | b |\\n| 1 | 2 |"', "line 1: this table has no line of dashes under its header", actor=story.user)
    story.expect_refusal('doc edit 1 --body "##Totals"', "line 1: a heading needs a space after its # marks", actor=story.user)
    story.expect_refusal('doc edit 1 --body "## A\\n#### B"', "line 2: this heading skips from level 2 to level 4", actor=story.user)
    story.expect_refusal('doc edit 1 --replace "in cents" --with "in \\`cents"', "a backtick has no partner on this line", actor=story.user)
    story.expect_refusal('doc make "Bad" --abstract "A bad one" --body "```"', "this code fence is never closed", actor=story.user)


def test_an_abstract_edit_of_an_old_text_with_a_fault_is_not_refused(new_story):
    story = doc_story(new_story)
    story.container.get(Database).connection.execute("UPDATE docs SET body = '```' WHERE id = 1")
    story.expect_success('doc edit 1 --abstract "A new line"', "doc 1 written anew: Cart rules", actor=story.user)


def test_a_document_is_closed_only_with_the_reason_it_needs_no_action(new_story):
    story = doc_story(new_story)
    story.expect_refusal('doc settle 1 --why ""', 'doc 1 is closed only with the reason it needs no action: --why "<why>"', actor=story.user)
    story.expect_success('doc settle 1 --why "only reference"', "doc 1 closed: only reference", actor=story.user)
