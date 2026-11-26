<?php

declare(strict_types=1);

namespace Tests\Unit\Bus;

use App\Attributes\Validation\OneLine;
use Illuminate\Validation\ValidationException;
use Tests\Fixtures\Bus\OneLineTitle;
use Tests\TestCase;

/**
 * A text marked OneLine passes with blanks and line breaks around it and fails with a line break between two words.
 */
final class OneLineTest extends TestCase
{
    private const string BLANK_PADDED_TITLE = <<<TEXT

          Release notes \r
         
        TEXT;

    private const string ONE_LINE_REFUSAL = 'must be one line';

    private const string TITLE_WITH_BREAK = "Release notes\n";

    public function test_a_trailing_line_break_passes(): void
    {
        $title = $this->titled(self::TITLE_WITH_BREAK);

        $this->assertSame(self::TITLE_WITH_BREAK, $title->title);
    }

    public function test_leading_and_trailing_blanks_pass(): void
    {
        $title = $this->titled(<<<TEXT

          Release notes \r
         
        TEXT);

        $this->assertSame(self::BLANK_PADDED_TITLE, $title->title);
    }

    public function test_a_line_break_between_two_words_fails(): void
    {
        foreach (["Release\nnotes", "Release \r\n  notes", "Release\rnotes"] as $text) {
            try {
                $this->titled($text);
                $this->fail('A text over two lines passed.');
            } catch (ValidationException $refusal) {
                $this->assertStringContainsString(self::ONE_LINE_REFUSAL, $refusal->errors()['title'][0]);
            }
        }
    }

    private function titled(string $text): OneLineTitle
    {
        return OneLineTitle::validateAndCreate(['title' => $text]);
    }
}
