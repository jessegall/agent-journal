<?php

declare(strict_types=1);

namespace Tests\Unit\Text;

use App\Text\Support\MarkdownText;
use App\Text\Support\TextPart;
use PHPUnit\Framework\TestCase;

/**
 * A rendered body marks each heading, paragraph, list item and code block with the source lines it came from, so a
 * selection in the page can be traced back to its lines; an author cannot write those marks.
 */
final class SourceLineMarksTest extends TestCase
{
    public function test_each_block_carries_its_source_lines(): void
    {
        $markdown = <<<'TEXT'
        # Goal

        Ship the editor
        this week.

        - one
        - two

        ```
        code
        ```

        TEXT;
        $html = MarkdownText::body($markdown)->toSafeHtml();

        $this->assertStringContainsString('<h1 data-source-first="1" data-source-last="1">Goal</h1>', $html);
        $this->assertStringContainsString('<p data-source-first="3" data-source-last="4">', $html);
        $this->assertStringContainsString('<li data-source-first="6" data-source-last="6">', $html);
        $this->assertStringContainsString('<li data-source-first="7" data-source-last="7">', $html);
        $this->assertStringContainsString('<code data-source-first="9" data-source-last="11">', $html);
    }

    public function test_a_part_keeps_the_line_numbers_of_the_whole_text(): void
    {
        $html = new TextPart(<<<'TEXT'
        ## Later

        Text.
        TEXT, 40, 42, null)->toSafeHtml();

        $this->assertStringContainsString('<h2 data-source-first="40" data-source-last="40">Later</h2>', $html);
        $this->assertStringContainsString('<p data-source-first="42" data-source-last="42">Text.</p>', $html);
    }

    public function test_an_author_cannot_write_a_source_mark(): void
    {
        $html = MarkdownText::body("<p data-source-first=\"99\">forged</p>\n")->toSafeHtml();

        $this->assertStringContainsString('&lt;p data-source-first="99"&gt;forged&lt;/p&gt;', $html);
        $this->assertStringNotContainsString('<p data-source-first="99"', $html);
    }

    public function test_a_comment_body_has_no_source_marks(): void
    {
        $this->assertStringNotContainsString('data-source', MarkdownText::safeHtmlOf(<<<'TEXT'
        # A heading

        A line.

        TEXT));
    }
}
