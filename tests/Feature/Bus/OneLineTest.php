<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Attributes\OneLine;
use App\CoreApi;
use Illuminate\Validation\ValidationException;
use Tests\Fixtures\Bus\OneLineTitle;
use Tests\TestCase;

/**
 * A text marked OneLine passes with blanks and line breaks around it and fails with a line break between two words.
 */
final class OneLineTest extends TestCase
{
    public function test_a_trailing_line_break_passes(): void
    {
        $title = $this->titled("Release notes\n");

        $this->assertSame("Release notes\n", $title->title);
    }

    public function test_leading_and_trailing_blanks_pass(): void
    {
        $title = $this->titled("\n  Release notes \r\n ");

        $this->assertSame("\n  Release notes \r\n ", $title->title);
    }

    public function test_a_line_break_between_two_words_fails(): void
    {
        foreach (["Release\nnotes", "Release \r\n  notes", "Release\rnotes"] as $text) {
            try {
                $this->titled($text);
                $this->fail('A text over two lines passed.');
            } catch (ValidationException $refusal) {
                $this->assertStringContainsString('must be one line', $refusal->errors()['title'][0]);
            }
        }
    }

    public function test_the_attribute_is_exported_from_core(): void
    {
        $this->assertTrue(CoreApi::exports()->has(OneLine::class));
    }

    private function titled(string $text): OneLineTitle
    {
        return OneLineTitle::validateAndCreate(['title' => $text]);
    }
}
