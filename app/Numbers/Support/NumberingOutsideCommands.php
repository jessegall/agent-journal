<?php

declare(strict_types=1);

namespace App\Numbers\Support;

/**
 * Lets numbered records be created outside a bus command, for the database seeder and the tests only; the application
 * never allows it, so a production write that skips the bus fails by name.
 */
final class NumberingOutsideCommands
{
    private bool $allowed = false;

    public function allow(): void
    {
        $this->allowed = true;
    }

    public function forbid(): void
    {
        $this->allowed = false;
    }

    public function isAllowed(): bool
    {
        return $this->allowed;
    }
}
