<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Unit;

use App\Text\Exceptions\MarkdownInvalid;
use App\Text\Support\MarkdownText;
use PHPUnit\Framework\TestCase;

/**
 * A document body keeps every character but its line endings, refuses an unclosed fence, reads by sections and
 * renders to HTML that runs nothing.
 */
final class MarkdownTextTest extends TestCase
{
    private const string LATER_SECTIONS = <<<'TEXT'
        # Four
        d  

        # Five
        e

        TEXT;

    private const string REPLACED_THIRD = <<<'TEXT'
        # Three
        new third
        # Four
        TEXT;

    public function test_accents_emoji_and_shell_code_come_back_unchanged(): void
    {
        $body = <<<TEXT
        Caf\u{e9} \u{1F600}

        ```sh
        echo "\$HOME" | grep -v x
        ```

        TEXT;

        $this->assertSame($body, MarkdownText::body(str_replace("\n", "\r\n", $body))->text);
    }

    public function test_an_unclosed_fence_is_refused_with_its_line(): void
    {
        $this->expectExceptionObject(MarkdownInvalid::unclosedFence(3));

        MarkdownText::body(<<<'TEXT'
        # Title

        ```php
        echo 1;

        TEXT);
    }

    public function test_a_setext_heading_is_in_the_outline(): void
    {
        $text = MarkdownText::body(<<<'TEXT'
        Intro

        Goal
        ====

        Text

        TEXT);

        $this->assertSame(['', 'Goal'], array_map(fn ($section) => $section->heading, $text->sections));
    }

    public function test_replacing_a_section_keeps_every_later_section_byte_for_byte(): void
    {
        $text = MarkdownText::body(<<<'TEXT'
        # One
        a
        # Two
        b
        # Three
        c
        # Four
        d  

        # Five
        e

        TEXT);

        $replaced = $text->withSectionReplaced(3, 'new third');

        $this->assertStringEndsWith(self::LATER_SECTIONS, $replaced->text);

        $this->assertStringContainsString(self::REPLACED_THIRD, $replaced->text);
    }

    public function test_a_script_tag_comes_out_escaped(): void
    {
        $html = MarkdownText::body("Hello <script>alert(1)</script>\n")->toSafeHtml();

        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringContainsString('&lt;script&gt;', $html);
    }
}
