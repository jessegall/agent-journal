<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

/**
 * Whether a text is exactly one emoji: one grapheme that is a pictograph or a flag, with its modifiers, variation
 * selectors and joined parts kept.
 */
final readonly class Emoji
{
    public static function isOne(string $text): bool
    {
        return grapheme_strlen($text) === 1
            && preg_match('/\p{Extended_Pictographic}|\p{Regional_Indicator}|[\x{1F1E6}-\x{1F1FF}]/u', $text) === 1;
    }
}
