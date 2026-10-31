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


def test_a_document_is_closed_only_with_the_reason_it_needs_no_action(new_story):
    story = doc_story(new_story)
    story.expect_refusal('doc close 1 --why ""', 'doc 1 is closed only with the reason it needs no action: --why "<why>"', actor=story.user)
    story.expect_success('doc close 1 --why "only reference"', "doc 1 closed: only reference", actor=story.user)
