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

    public function allow(): void
    {
        $this->isAllowed = true;
    }

    public function forbid(): void
    {
        $this->isAllowed = false;
    }

    /**
     * Runs the work as the running app runs it, where writes outside a command are refused until the work itself
     * allows them, as the database seeder does; the allowance from before holds again once the work ends.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function forbidDuring(Closure $work): mixed
    {
        $wasAllowed = $this->isAllowed;
        $this->isAllowed = false;

        try {
            return $work();
        } finally {
            $this->isAllowed = $wasAllowed;
        }
    }

    public function isAllowed(): bool
    {
        return $this->isAllowed;
    }
}
