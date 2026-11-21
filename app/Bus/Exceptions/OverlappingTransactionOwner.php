<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

/**
 * A second transaction owner opened on another connection while one already holds an event unit: they would share
 * Laravel's one transaction manager, so a callback or a released fact could bind to the other's transaction.
 */
final class OverlappingTransactionOwner extends RuntimeException
{
    public static function on(string $connection, string $open): self
    {
        return new self(
            "A transaction on {$connection} cannot own an event unit while {$open} holds one; finish that first.",
        );
    }
}
