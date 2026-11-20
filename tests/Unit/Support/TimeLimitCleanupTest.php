<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A test's cleanup runs whole after its own time: the alarm stops before tearDown, so the rows it committed are still
 * emptied however long the test itself took.
 */
final class TimeLimitCleanupTest extends TestCase
{
    #[TimeLimit(seconds: 1, reason: 'Its cleanup outlasts this second on purpose.')]
    public function test_a_cleanup_that_outlasts_the_tests_limit_is_not_cut_short(): void
    {
        $this->beforeApplicationDestroyed(fn () => usleep(1_200_000));

        $this->assertTrue(true);
    }
}
