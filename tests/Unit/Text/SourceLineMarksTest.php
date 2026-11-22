<?php

declare(strict_types=1);

namespace Tests\Unit\Text;

use App\Support\MarkdownText;
use App\Support\TextPart;
use PHPUnit\Framework\TestCase;

/**
 * A rendered body marks each heading, paragraph, list item and code block with the source lines it came from, so a
 * selection in the page can be traced back to its lines; an author cannot write those marks.
 */
final class SourceLineMarksTest extends TestCase
{
    private const string ESCAPED_FORGERY = '&lt;p data-source-first="99"&gt;forged&lt;/p&gt;';

    private const string FORGED_OPENING = '<p data-source-first="99"';

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

        $this->assertStringContainsString($this->opening('h1', 1, 1).'Goal</h1>', $html);
        $this->assertStringContainsString($this->opening('p', 3, 4), $html);
        $this->assertStringContainsString($this->opening('li', 6, 6), $html);
        $this->assertStringContainsString($this->opening('li', 7, 7), $html);
        $this->assertStringContainsString($this->opening('code', 9, 11), $html);
    }

    public function test_a_part_keeps_the_line_numbers_of_the_whole_text(): void
    {
        $html = new TextPart(<<<'TEXT'
        ## Later

        Text.
        TEXT, 40, 42, null)->toSafeHtml();

        $this->assertStringContainsString($this->opening('h2', 40, 40).'Later</h2>', $html);
        $this->assertStringContainsString($this->opening('p', 42, 42).'Text.</p>', $html);
    }

    public function test_an_author_cannot_write_a_source_mark(): void
    {
        $html = MarkdownText::body("<p data-source-first=\"99\">forged</p>\n")->toSafeHtml();

        $this->assertStringContainsString(self::ESCAPED_FORGERY, $html);
        $this->assertStringNotContainsString(self::FORGED_OPENING, $html);
    }

    public function test_a_comment_body_has_no_source_marks(): void
    {
        $this->assertStringNotContainsString('data-source', MarkdownText::safeHtmlOf(<<<'TEXT'
        # A heading

        A line.

        TEXT));
    }

    private function opening(string $tag, int $first, int $last): string
    {
        return sprintf('<%s data-source-first="%d" data-source-last="%d">', $tag, $first, $last);
    }
}
