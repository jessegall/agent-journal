<?php

declare(strict_types=1);

namespace App\Web\Values;

use Illuminate\Support\Str;

final class PaneExcerpt
{
    private const int CHARACTER_LIMIT = 120;

    public static function of(string $text): string
    {
        return Str::limit(Str::squish($text), self::CHARACTER_LIMIT);
    }
}
