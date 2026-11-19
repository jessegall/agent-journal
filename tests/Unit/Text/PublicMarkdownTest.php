<?php

declare(strict_types=1);

namespace Tests\Unit\Text;

use App\Text\Support\MarkdownText;
use PHPUnit\Framework\TestCase;

/**
 * Markdown shown to the public: raw HTML is escaped, unsafe links are dropped, images become links, and a link that
 * does not leave for an http or https address is shown as plain text.
 */
final class PublicMarkdownTest extends TestCase
{
    public function test_public_html_keeps_only_outgoing_links_and_fetches_nothing(): void
    {
        $html = MarkdownText::publicHtmlOf("<script>alert(1)</script>\n\n[run](javascript:alert(1)) "
            ."[site](https://example.com) [doc](/s/token/records) ![logo](https://example.com/logo.png)\n");

        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('javascript:', $html);
        $this->assertStringNotContainsString('<img', $html);
        $this->assertStringContainsString('<a rel="noopener noreferrer" href="https://example.com">site</a>', $html);
        $this->assertStringContainsString('href="https://example.com/logo.png"', $html);
        $this->assertStringNotContainsString('href="/s/token/records"', $html);
        $this->assertStringContainsString('doc', $html);
    }
}
