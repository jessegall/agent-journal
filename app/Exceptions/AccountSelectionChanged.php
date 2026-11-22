<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StaleRefusal;
use RuntimeException;

/**
 * The driver's default account changed since the page showed it, so a choice made against the older one is refused;
 * the page reads the current default again.
 */
final class AccountSelectionChanged extends RuntimeException implements StaleRefusal
{
    public static function forDriver(string $driver): self
    {
        return new self("Another default account was chosen for {$driver} meanwhile; the current one is shown.");
    }

    public function staleCode(): string
    {
        return 'stale-version';
    }
}
