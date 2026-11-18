<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Fixed record ids for tests, written as ULIDs: TestIds::of(1) is the same valid ULID in every test, so a test can name
 * agent 1 or session 10 as before.
 */
final class TestIds
{
    public static function of(int $number): string
    {
        return sprintf('01jd8x0g9m3qz6v4k2%08d', $number);
    }
}
