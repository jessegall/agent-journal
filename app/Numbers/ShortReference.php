<?php

declare(strict_types=1);

namespace App\Numbers;

/**
 * A short reference read aloud or typed by hand: a prefix, a dash and eight letters or digits that are never
 * mistaken for each other (no 0, O, 1, I or L).
 */
final class ShortReference
{
    private const string LETTERS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

    private const int LENGTH = 8;

    public static function withPrefix(string $prefix): string
    {
        $letters = '';

        for ($index = 0; $index < self::LENGTH; $index++) {
            $letters .= self::LETTERS[random_int(0, strlen(self::LETTERS) - 1)];
        }

        return "{$prefix}-{$letters}";
    }
}
