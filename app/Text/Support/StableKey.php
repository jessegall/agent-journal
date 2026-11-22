<?php

declare(strict_types=1);

namespace App\Text\Support;

/**
 * The grammar of a stable key such as journal-reviewer: lowercase ASCII letters and digits in words joined by single
 * hyphens, 1 to 64 characters. Profile, skill, driver and provider keys share it.
 */
final class StableKey
{
    private const string PATTERN = '/^[a-z0-9]+(-[a-z0-9]+)*$/D';

    private const int MOST_CHARACTERS = 64;

    public static function isValid(string $text): bool
    {
        return strlen($text) <= self::MOST_CHARACTERS && preg_match(self::PATTERN, $text) === 1;
    }
}
