<?php

declare(strict_types=1);

namespace Tests\Unit\Text;

use App\Support\TextPreview;
use PHPUnit\Framework\TestCase;

/**
 * A preview keeps a text that fits whole and ends a cut one in …, within its bytes and on a character boundary.
 */
final class TextPreviewTest extends TestCase
{
    private const string SHORT_TITLE = 'Short title';

    public function test_a_text_that_fits_is_kept_whole(): void
    {
        $this->assertSame(self::SHORT_TITLE, TextPreview::within(self::SHORT_TITLE, 20));
    }

    public function test_a_longer_text_ends_in_an_ellipsis_within_its_bytes(): void
    {
        $preview = TextPreview::within(str_repeat('é', 40), 20);

        $this->assertStringEndsWith('…', $preview);
        $this->assertLessThanOrEqual(20, strlen($preview));
        $this->assertTrue(mb_check_encoding($preview, 'UTF-8'));
    }
}
