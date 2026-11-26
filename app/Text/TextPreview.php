<?php

declare(strict_types=1);

namespace App\Text;

/**
 * The start of a text within a number of bytes, ending in … when the text was longer, so a reader sees it was cut.
 */
final class TextPreview
{
    public static function within(string $text, int $bytes): string
    {
        if (strlen($text) <= $bytes) {
            return $text;
        }

        return mb_strcut($text, 0, $bytes - strlen('…')).'…';
    }
}
