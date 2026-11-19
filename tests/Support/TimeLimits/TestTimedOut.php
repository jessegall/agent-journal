<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits;

use RuntimeException;

/**
 * A test ran past its time limit and was stopped, so one hanging test cannot stall the run.
 */
final class TestTimedOut extends RuntimeException
{
    public static function after(string $test, int $seconds): self
    {
        return new self(
            "{$test} ran longer than its {$seconds} second limit; make it faster, or give it #[TimeLimit] with a reason.",
        );
    }

    public static function preparing(string $test, int $seconds): self
    {
        return new self("Preparing {$test} took longer than {$seconds} seconds; something it sets up is waiting.");
    }
}
