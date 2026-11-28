<?php

declare(strict_types=1);

namespace App\Values;

final readonly class RetrySchedule
{
    public const int RETRY_LIMIT = 3;

    private const int FIRST_WAIT_SECONDS = 5;

    public static function waitBefore(int $retry): int
    {
        return self::FIRST_WAIT_SECONDS << ($retry - 1);
    }

    public static function isLast(int $retry): bool
    {
        return $retry >= self::RETRY_LIMIT;
    }
}
