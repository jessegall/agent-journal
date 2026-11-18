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
    public function test_accents_emoji_and_shell_code_come_back_unchanged(): void
    {
        $body = "Caf\u{e9} \u{1F600}\n\n```sh\necho \"\$HOME\" | grep -v x\n```\n";

        $this->assertSame($body, MarkdownText::body(str_replace("\n", "\r\n", $body))->text);
    }

    public function test_an_unclosed_fence_is_refused_with_its_line(): void
    {
        $this->expectExceptionObject(MarkdownInvalid::unclosedFence(3));

        MarkdownText::body("# Title\n\n```php\necho 1;\n");
    }

    public function test_a_setext_heading_is_in_the_outline(): void
    {
        $text = MarkdownText::body("Intro\n\nGoal\n====\n\nText\n");

        $this->assertSame(['', 'Goal'], array_map(fn ($section) => $section->heading, $text->sections));
    }

    public function test_replacing_a_section_keeps_every_later_section_byte_for_byte(): void
    {
        $text = MarkdownText::body("# One\na\n# Two\nb\n# Three\nc\n# Four\nd  \n\n# Five\ne\n");
        $replaced = $text->withSectionReplaced(3, 'new third');

        $this->assertStringEndsWith("# Four\nd  \n\n# Five\ne\n", $replaced->text);
        $this->assertStringContainsString("# Three\nnew third\n# Four", $replaced->text);
    }

    public function test_a_script_tag_comes_out_escaped(): void
    {
        $html = MarkdownText::body("Hello <script>alert(1)</script>\n")->toSafeHtml();

        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringContainsString('&lt;script&gt;', $html);
    }
}
