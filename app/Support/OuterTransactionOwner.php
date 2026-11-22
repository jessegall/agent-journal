<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Marks an outer transaction no command opened as a known owner, so the first command joining it owns an event unit
 * as a commit would: the test wrapper's transaction only, which the test base registers; the application never does.
 */
final class OuterTransactionOwner
{
    private bool $registered = false;

    public function register(): void
    {
        $this->registered = true;
    }

    public function isRegistered(): bool
    {
        return $this->registered;
    }
}
