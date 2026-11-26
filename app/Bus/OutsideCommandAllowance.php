<?php

declare(strict_types=1);

namespace App\Bus;

use Closure;

/**
 * Lets numbered records be created, and event sources be saved with no event unit, outside a bus command: for the
 * database seeder and a test's own seeding only. The application never allows it, so a production write that skips
 * the bus fails by name.
 */
final class OutsideCommandAllowance
{
    private bool $isAllowed = false;

    /**
     * How many runs of forbidDuring are open now, one inside another.
     */
    private int $openRefusals = 0;

    public function allow(): void
    {
        $this->isAllowed = true;
    }

    public function forbid(): void
    {
        $this->isAllowed = false;
    }

    /**
     * Runs the work with writes outside a command refused, as the running app refuses them; the allowance holds again
     * once the work ends.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function forbidDuring(Closure $work): mixed
    {
        $this->openRefusals++;

        try {
            return $work();
        } finally {
            $this->openRefusals--;
        }
    }

    public function isAllowed(): bool
    {
        return $this->isAllowed && $this->openRefusals === 0;
    }
}
