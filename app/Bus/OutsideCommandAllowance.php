<?php

declare(strict_types=1);

namespace App\Bus;

/**
 * Lets numbered records be created, and event sources be saved with no event unit, outside a bus command: for the
 * database seeder and the tests only. The application never allows it, so a production write that skips the bus fails
 * by name.
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

    public function isAllowed(): bool
    {
        return $this->isAllowed;
    }
}
