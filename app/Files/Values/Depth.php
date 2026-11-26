<?php

declare(strict_types=1);

namespace App\Files\Values;

use App\Files\Exceptions\DepthTooDeep;

/**
 * How many folder levels a list or walk descends: one level, the folder's own entries, unless the call asks for more.
 */
final readonly class Depth
{
    public const int LEVEL_LIMIT = 16;

    public function __construct(public int $levels)
    {
        if ($levels < 1 || $levels > self::LEVEL_LIMIT) {
            throw DepthTooDeep::asked($levels, self::LEVEL_LIMIT);
        }
    }

    public static function one(): self
    {
        return new self(1);
    }

    public static function levels(int $levels): self
    {
        return new self($levels);
    }
}
